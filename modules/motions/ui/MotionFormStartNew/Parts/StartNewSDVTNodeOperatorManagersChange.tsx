import { constants, utils } from 'ethers'

import { Fragment, useMemo } from 'react'
import { useFieldArray, useFormContext, useFormState } from 'react-hook-form'
import { Plus, ButtonIcon, Option } from '@lidofinance/lido-ui'
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

import { ContractSDVTNodeOperatorManagerChange } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { SelectControl } from 'modules/shared/ui/Controls/Select'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { checkAddressForManageSigningKeysRole } from 'modules/motions/utils/checkAddressForManageSigningKeysRole'
import { noSigningKeysRoleError } from 'modules/motions/constants'

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
    const { walletAddress, chainId } = useWeb3()
    const {
      data: nodeOperatorsList,
      initialLoading: isNodeOperatorsDataLoading,
    } = useSDVTNodeOperatorsList()

    const activeNodeOperators = nodeOperatorsList?.filter(
      nodeOperator => nodeOperator.active,
    )

    const trustedCaller = ContractSDVTNodeOperatorManagerChange.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
    const { watch, setValue } = useFormContext()
    const { isValid } = useFormState()
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    )

    const managerAddressesMap = useMemo(
      () =>
        nodeOperatorsList?.reduce((acc, item) => {
          if (!item.managerAddress) {
            return acc
          }

          acc[item.managerAddress] = item.id
          return acc
        }, {} as Record<string, number | undefined>) ?? {},
      [nodeOperatorsList],
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
        {fieldsArr.fields.map((item, i) => {
          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <FieldsHeaderDesc>Update #{i + 1}</FieldsHeaderDesc>
                  )}
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton onClick={() => fieldsArr.remove(i)}>
                      Remove update {i + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <SelectControl
                    label="Node Operator"
                    name={`${fieldNames.nodeOperators}.${i}.id`}
                    rules={{ required: 'Field is required' }}
                    onChange={(value: string) => {
                      const nodeOperatorId = Number(value)
                      const managerAddress =
                        nodeOperatorsList[nodeOperatorId]?.managerAddress

                      if (managerAddress) {
                        const newNodeOperators = [...selectedNodeOperators]
                        newNodeOperators[i].oldManagerAddress = managerAddress
                        setValue(fieldNames.nodeOperators, newNodeOperators)
                      }
                    }}
                  >
                    {getFilteredOptions(i).map(nodeOperator => (
                      <Option
                        key={nodeOperator.id}
                        value={nodeOperator.id}
                        children={`${nodeOperator.name} (id: ${nodeOperator.id})`}
                      />
                    ))}
                  </SelectControl>
                </Fieldset>

                <Fieldset>
                  <InputControl
                    name={`${fieldNames.nodeOperators}.${i}.oldManagerAddress`}
                    label="Manager Address"
                    disabled={
                      !!nodeOperatorsList[Number(selectedNodeOperators[i].id)]
                        .managerAddress
                    }
                    rules={{
                      required: 'Field is required',
                      validate: async value => {
                        if (!utils.isAddress(value))
                          return 'Address is not valid'

                        const valueAddress = utils.getAddress(value)
                        if (valueAddress === constants.AddressZero) {
                          return 'Address must not be zero address'
                        }

                        const canAddressManageKeys =
                          await checkAddressForManageSigningKeysRole(
                            valueAddress,
                            selectedNodeOperators[i].id,
                            chainId,
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
                    name={`${fieldNames.nodeOperators}.${i}.newManagerAddress`}
                    label="New Manager Address"
                    rules={{
                      required: 'Field is required',
                      validate: async value => {
                        if (!utils.isAddress(value))
                          return 'Address is not valid'

                        const valueAddress = utils.getAddress(value)

                        const idInAdrressMap = managerAddressesMap[valueAddress]
                        if (typeof idInAdrressMap === 'number') {
                          return 'Address must not be in use by another node operator'
                        }

                        const addressInSelectedNodeOperatorsIndex =
                          selectedNodeOperators.findIndex(
                            ({ newManagerAddress, id }) =>
                              newManagerAddress &&
                              utils.getAddress(newManagerAddress) ===
                                utils.getAddress(valueAddress) &&
                              id !== selectedNodeOperators[i].id,
                          )

                        if (addressInSelectedNodeOperatorsIndex !== -1) {
                          return 'This address is already in use by another update'
                        }

                        if (valueAddress === constants.AddressZero) {
                          return 'Address must not be zero address'
                        }

                        const canAddressManageKeys =
                          await checkAddressForManageSigningKeysRole(
                            valueAddress,
                            selectedNodeOperators[i].id,
                            chainId,
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

        {selectedNodeOperators.length < activeNodeOperators.length && isValid && (
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
