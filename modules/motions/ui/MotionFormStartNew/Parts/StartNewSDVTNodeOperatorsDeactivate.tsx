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

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTNodeOperatorsDeactivate,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedNodeOperators = formData.nodeOperators.sort(
      (a, b) => Number(a.id) - Number(b.id),
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

    const activeNodeOperators = nodeOperatorsList?.filter(
      nodeOperator => nodeOperator.active,
    )

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
                          await checkIsAddressManagerOfNodeOperator(
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
