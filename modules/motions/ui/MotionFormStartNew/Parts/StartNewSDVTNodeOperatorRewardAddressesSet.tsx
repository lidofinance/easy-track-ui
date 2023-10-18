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

import { ContractSDVTNodeOperatorRewardAddressesSet } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { SelectControl } from 'modules/shared/ui/Controls/Select'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { STETH } from 'modules/blockChain/contractAddresses'

type NodeOperator = {
  id: string
  newRewardAddress: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTNodeOperatorRewardAddressesSet,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedNodeOperators = formData.nodeOperators.sort(
      (a, b) => Number(a.id) - Number(b.id),
    )

    const encodedCallData = new utils.AbiCoder().encode(
      ['tuple(uint256 nodeOperatorId, address rewardAddress)[]'],
      [
        sortedNodeOperators.map(nodeOperator => ({
          nodeOperatorId: Number(nodeOperator.id),
          rewardAddress: utils.getAddress(nodeOperator.newRewardAddress),
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
        newRewardAddress: '',
      },
    ] as NodeOperator[],
  }),
  Component: function StartNewMotionMotionFormLego({
    fieldNames,
    submitAction,
  }) {
    const { walletAddress, chainId } = useWeb3()
    const {
      data: nodeOperatorsList,
      initialLoading: isNodeOperatorsDataLoading,
    } = useSDVTNodeOperatorsList()

    const trustedCaller = ContractSDVTNodeOperatorRewardAddressesSet.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
    const { watch } = useFormContext()
    const { isValid } = useFormState()
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    )

    const nodeOperatorRewardAddressesMap = useMemo(() => {
      const result: Record<number, string | undefined> = {}

      if (nodeOperatorsList?.length) {
        for (const nodeOperator of nodeOperatorsList) {
          result[nodeOperator.id] = nodeOperator.rewardAddress
        }
      }

      for (const nodeOperator of selectedNodeOperators) {
        if (nodeOperator.newRewardAddress) {
          result[parseInt(nodeOperator.id)] = utils.getAddress(
            nodeOperator.newRewardAddress,
          )
        }
      }

      const invertedRecord: Record<string, number | undefined> = {}
      for (const key in result) {
        const value = result[key]
        if (value) {
          invertedRecord[value] = parseInt(key)
        }
      }

      return invertedRecord
    }, [nodeOperatorsList, selectedNodeOperators])

    const getFilteredOptions = (fieldIdx: number) => {
      if (!nodeOperatorsList?.length) {
        return []
      }
      const selectedIds = selectedNodeOperators.map(({ id }) => parseInt(id))
      const thisId = parseInt(selectedNodeOperators[fieldIdx]?.id)
      return nodeOperatorsList.filter(
        ({ id }) => !selectedIds.includes(id) || id === thisId,
      )
    }

    const handleAddUpdate = () =>
      fieldsArr.append({
        id: '',
        newRewardAddress: '',
      } as NodeOperator)

    if (trustedCaller.initialLoading || isNodeOperatorsDataLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!nodeOperatorsList?.length) {
      return <MessageBox>Node operators list is empty</MessageBox>
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
                    name={`${fieldNames.nodeOperators}.${i}.newRewardAddress`}
                    label="New Reward Address"
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        if (!utils.isAddress(value))
                          return 'Address is not valid'

                        const valueAddress = utils.getAddress(value)

                        const currentId = Number(selectedNodeOperators[i].id)
                        const idInAdrressMap =
                          nodeOperatorRewardAddressesMap[valueAddress]

                        if (
                          typeof idInAdrressMap === 'number' &&
                          idInAdrressMap !== currentId
                        ) {
                          return 'Address must not be in use by another node operator'
                        }

                        if (valueAddress === constants.AddressZero) {
                          return 'Address must not be zero address'
                        }

                        const stETHAddress = STETH[chainId]

                        if (
                          stETHAddress &&
                          valueAddress === utils.getAddress(stETHAddress)
                        ) {
                          return 'Address must not be stETH address'
                        }
                      },
                    }}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          )
        })}

        {selectedNodeOperators.length < nodeOperatorsList.length && isValid && (
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
