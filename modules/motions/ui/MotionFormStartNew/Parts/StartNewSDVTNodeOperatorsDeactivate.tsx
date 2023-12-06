import { utils } from 'ethers'

import { Fragment } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, ButtonIcon } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
} from '../CreateMotionFormStyle'

import { ContractSDVTNodeOperatorsDeactivate } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { checkIsAddressManagerOfNodeOperator } from 'modules/motions/utils/checkAddressManagerRole'
import { noSigningKeysRoleError } from 'modules/motions/constants'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { NodeOperatorSelectControl } from '../../NodeOperatorSelectControl'

type NodeOperator = {
  id: string
  managerAddress: string
}

/*

Deactivate Node Operators
Sort the data before sending
  The list of DeactivateNodeOperatorInput MUST be sorted in strictly ascending order by the nodeOperatorId key (duplicates are not allowed)
No unregistered Node Operators
  Each node operator in the set MUST be registered in the registry
Only active Node Operators
  Each node operator in the set MUST be in the activated state
Only valid manager addresses
  error
  Each manager address in the set MUST be granted with a parametrized version of MANAGE_SIGNING_KEYS permission for the corresponding node operator
No duplicates in concurrent motions
  error
  if there are active or pending motions of this type, check that no the same node operators among them.
Manager addresses is not used in change manager motions
  error
  if there are active or pending motions to change the address of the node operator’s manager, check that it doesn't change the manager for node operator to be disabled.
 */

const spec = {
  sortDataBeforeSending: (a: NodeOperator, b: NodeOperator) =>
    Number(a.id) - Number(b.id),

  eachNORegistered: () => true,

  onlyActiveNO: (nodeOperator: { active: boolean }) => nodeOperator.active,

  onlyValidManagerAddresses: async (
    manager: string,
    NOId: string,
    chainId: number,
  ) => checkIsAddressManagerOfNodeOperator(manager, NOId, chainId),
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTNodeOperatorsDeactivate,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedNodeOperators = formData.nodeOperators.sort(
      spec.sortDataBeforeSending,
    )

    const encodedCallData = new utils.AbiCoder().encode(
      ['tuple(uint256 nodeOperatorId, address managerAddress)[]'],
      [
        sortedNodeOperators.map(nodeOperator => ({
          nodeOperatorId: Number(nodeOperator.id),
          managerAddress: utils.getAddress(nodeOperator.managerAddress),
        })),
      ],
    )
    const gasLimit = await estimateGasFallback(
      contract.estimateGas.createMotion(evmScriptFactory, encodedCallData),
    )
    const tx = await contract.populateTransaction.createMotion(
      evmScriptFactory,
      encodedCallData,
      { gasLimit },
    )
    return tx
  },
  getDefaultFormData: () => ({
    nodeOperators: [
      {
        id: '',
        managerAddress: '',
      },
    ] as NodeOperator[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress, chainId } = useWeb3()
    const {
      data: nodeOperatorsList,
      initialLoading: isNodeOperatorsDataLoading,
    } = useSDVTNodeOperatorsList()

    const activeNodeOperators = nodeOperatorsList?.filter(spec.onlyActiveNO)

    const trustedCaller = ContractSDVTNodeOperatorsDeactivate.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
    const { watch, setValue } = useFormContext()
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    )

    const getFilteredOptions = (fieldIdx: number) => {
      if (!activeNodeOperators?.length) return []
      const selectedIds = selectedNodeOperators.map(({ id }) => parseInt(id))
      const thisId = parseInt(selectedNodeOperators[fieldIdx]?.id)
      return activeNodeOperators.filter(
        ({ id }) => !selectedIds.includes(id) || id === thisId,
      )
    }

    const handleAddUpdate = () =>
      fieldsArr.append({
        id: '',
        managerAddress: '',
      } as NodeOperator)

    if (trustedCaller.initialLoading || isNodeOperatorsDataLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!nodeOperatorsList?.length || !activeNodeOperators?.length) {
      return <MessageBox>There are no node operators to deactivate</MessageBox>
    }

    return (
      <>
        {fieldsArr.fields.map((item, fieldIndex) => {
          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <FieldsHeaderDesc>
                      Update #{fieldIndex + 1}
                    </FieldsHeaderDesc>
                  )}
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => fieldsArr.remove(fieldIndex)}
                    >
                      Remove update {fieldIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <NodeOperatorSelectControl
                    name={`${fieldNames.nodeOperators}.${fieldIndex}.id`}
                    options={getFilteredOptions(fieldIndex)}
                    onChange={(value: string) => {
                      const nodeOperator = nodeOperatorsList[Number(value)]

                      if (nodeOperator.managerAddress) {
                        setValue(
                          `${fieldNames.nodeOperators}.${fieldIndex}.managerAddress`,
                          nodeOperator.managerAddress,
                        )
                      }
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputControl
                    name={`${fieldNames.nodeOperators}.${fieldIndex}.managerAddress`}
                    label="Manager address"
                    disabled={Boolean(
                      !selectedNodeOperators[fieldIndex].id ||
                        !!nodeOperatorsList[
                          Number(selectedNodeOperators[fieldIndex].id)
                        ].managerAddress,
                    )}
                    rules={{
                      required: 'Field is required',
                      validate: async value => {
                        const addressErr = validateAddress(value)
                        if (addressErr) {
                          return addressErr
                        }

                        const canAddressManageKeys =
                          await spec.onlyValidManagerAddresses(
                            value,
                            selectedNodeOperators[fieldIndex].id,
                            chainId,
                          )

                        if (!canAddressManageKeys) {
                          return noSigningKeysRoleError
                        }
                      },
                    }}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          )
        })}

        {selectedNodeOperators.length < activeNodeOperators.length && (
          <Fieldset>
            <ButtonIcon
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddUpdate}
              icon={<Plus />}
              color="secondary"
            >
              One more update
            </ButtonIcon>
          </Fieldset>
        )}

        {submitAction}
      </>
    )
  },
})
