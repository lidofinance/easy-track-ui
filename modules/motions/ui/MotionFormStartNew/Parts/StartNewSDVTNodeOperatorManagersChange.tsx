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
  ContractSDVTNodeOperatorManagerChange,
  ContractSDVTRegistry,
} from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { checkIsAddressManagerOfNodeOperator } from 'modules/motions/utils/checkAddressManagerRole'
import { noSigningKeysRoleError } from 'modules/motions/constants'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { NodeOperatorSelectControl } from '../../NodeOperatorSelectControl'
import { useGetSDVTOperatorManager } from 'modules/motions/hooks/useGetSDVTOperatorManager'

type NodeOperator = {
  id: string
  oldManagerAddress: string
  newManagerAddress: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTNodeOperatorManagerChange,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedNodeOperators = formData.nodeOperators.sort(
      (a, b) => Number(a.id) - Number(b.id),
    )

    const encodedCallData = new utils.AbiCoder().encode(
      [
        'tuple(uint256 nodeOperatorId, address oldManagerAddress, address newManagerAddress)[]',
      ],
      [
        sortedNodeOperators.map(nodeOperator => ({
          nodeOperatorId: Number(nodeOperator.id),
          oldManagerAddress: utils.getAddress(nodeOperator.oldManagerAddress),
          newManagerAddress: utils.getAddress(nodeOperator.newManagerAddress),
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
        oldManagerAddress: '',
        newManagerAddress: '',
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

    const { getManagerAddress, isManagerAddressLoading } =
      useGetSDVTOperatorManager()

    const activeNodeOperators = nodeOperatorsList?.filter(
      nodeOperator => nodeOperator.active,
    )

    const trustedCaller = ContractSDVTNodeOperatorManagerChange.useSwrWeb3(
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
        oldManagerAddress: '',
        newManagerAddress: '',
      } as NodeOperator)

    if (trustedCaller.initialLoading || isNodeOperatorsDataLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!nodeOperatorsList?.length || !activeNodeOperators?.length) {
      return <MessageBox>There are no active node operators</MessageBox>
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
                          `${fieldNames.nodeOperators}.${fieldIndex}.oldManagerAddress`,
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
                    name={`${fieldNames.nodeOperators}.${fieldIndex}.oldManagerAddress`}
                    label={
                      isManagerAddressLoading
                        ? 'Loading manager address...'
                        : 'Manager address'
                    }
                    disabled={
                      selectedNodeOperators[fieldIndex].id === '' ||
                      isManagerAddressLoading
                    }
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
                            sdvtRegistry,
                          )

                        if (!canAddressManageKeys) {
                          return noSigningKeysRoleError
                        }
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputControl
                    name={`${fieldNames.nodeOperators}.${fieldIndex}.newManagerAddress`}
                    label="New manager address"
                    rules={{
                      required: 'Field is required',
                      validate: async value => {
                        const addressErr = validateAddress(value)
                        if (addressErr) {
                          return addressErr
                        }

                        const valueAddress = utils.getAddress(value)

                        const addressInSelectedNodeOperatorsIndex =
                          selectedNodeOperators.findIndex(
                            ({ newManagerAddress }, index) =>
                              newManagerAddress &&
                              utils.getAddress(newManagerAddress) ===
                                valueAddress &&
                              fieldIndex !== index,
                          )

                        if (addressInSelectedNodeOperatorsIndex !== -1) {
                          return 'Address is already in use by another update'
                        }

                        const canAddressManageKeys =
                          await checkIsAddressManagerOfNodeOperator(
                            valueAddress,
                            selectedNodeOperators[fieldIndex].id,
                            sdvtRegistry,
                          )

                        if (canAddressManageKeys) {
                          return 'Address already has a signing keys manager role'
                        }

                        return true
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
