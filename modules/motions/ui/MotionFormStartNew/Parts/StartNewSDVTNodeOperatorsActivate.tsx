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

import {
  ContractAragonAcl,
  ContractSDVTNodeOperatorsActivate,
  ContractSDVTRegistry,
} from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { checkAddressForManageSigningKeysRole } from 'modules/motions/utils/checkAddressManagerRole'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { NodeOperatorSelectControl } from '../../NodeOperatorSelectControl'
import { useGetSDVTOperatorManager } from 'modules/motions/hooks/useGetSDVTOperatorManager'

type NodeOperator = {
  id: string
  managerAddress: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTNodeOperatorsActivate,
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
    const { walletAddress } = useWeb3()
    const {
      data: nodeOperatorsList,
      initialLoading: isNodeOperatorsDataLoading,
    } = useSDVTNodeOperatorsList()
    const sdvtRegistry = ContractSDVTRegistry.useRpc()
    const aragonAcl = ContractAragonAcl.useRpc()

    const { getManagerAddress, isManagerAddressLoading } =
      useGetSDVTOperatorManager()

    const deactivatedNodeOperators = nodeOperatorsList?.filter(
      nodeOperator => !nodeOperator.active,
    )

    const trustedCaller = ContractSDVTNodeOperatorsActivate.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
    const { watch, setValue } = useFormContext()
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    )

    const getFilteredOptions = (fieldIdx: number) => {
      if (!deactivatedNodeOperators?.length) return []
      const selectedIds = selectedNodeOperators.map(({ id }) => parseInt(id))
      const thisId = parseInt(selectedNodeOperators[fieldIdx]?.id)
      return deactivatedNodeOperators.filter(
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

    if (!nodeOperatorsList?.length || !deactivatedNodeOperators?.length) {
      return <MessageBox>There are no node operators to activate</MessageBox>
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

                      getManagerAddress(nodeOperator.id).then(address => {
                        setValue(
                          `${fieldNames.nodeOperators}.${fieldIndex}.managerAddress`,
                          address,
                          {
                            shouldValidate: true,
                          },
                        )
                      })
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputControl
                    name={`${fieldNames.nodeOperators}.${fieldIndex}.managerAddress`}
                    label={
                      isManagerAddressLoading
                        ? 'Loading manager address...'
                        : 'Manager address'
                    }
                    disabled={isManagerAddressLoading}
                    rules={{
                      required: 'Field is required',
                      validate: async value => {
                        const addressErr = validateAddress(value)
                        if (addressErr) {
                          return addressErr
                        }
                        const canAddressManageKeys =
                          await checkAddressForManageSigningKeysRole(
                            utils.getAddress(value),
                            sdvtRegistry,
                            aragonAcl,
                          )

                        if (canAddressManageKeys) {
                          return 'Address already has a signing keys manager role'
                        }
                      },
                    }}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          )
        })}

        {selectedNodeOperators.length < deactivatedNodeOperators.length && (
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
