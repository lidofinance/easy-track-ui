import { utils } from 'ethers'

import { Fragment, useMemo } from 'react'
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

import { ContractSDVTNodeOperatorRewardAddressesSet } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { STETH } from 'modules/blockChain/contractAddresses'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { NodeOperatorSelectControl } from '../../NodeOperatorSelectControl'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { useNodeOperatorsList } from 'modules/motions/hooks'

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
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress, chainId } = useWeb3()
    const {
      data: nodeOperatorsList,
      initialLoading: isNodeOperatorsDataLoading,
    } = useNodeOperatorsList('sdvt')

    const trustedCaller = ContractSDVTNodeOperatorRewardAddressesSet.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
    const { watch } = useFormContext()
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    )

    const rewardAddressesMap = useMemo(
      () =>
        nodeOperatorsList?.reduce((acc, item) => {
          acc[item.rewardAddress] = item.id
          return acc
        }, {} as Record<string, number | undefined>) ?? {},
      [nodeOperatorsList],
    )

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
                  />
                </Fieldset>

                {!isNaN(parseInt(selectedNodeOperators[fieldIndex]?.id)) ? (
                  <MotionInfoBox>
                    Current reward address:{' '}
                    {
                      nodeOperatorsList[
                        Number(selectedNodeOperators[fieldIndex].id)
                      ].rewardAddress
                    }
                  </MotionInfoBox>
                ) : null}

                <Fieldset>
                  <InputControl
                    name={`${fieldNames.nodeOperators}.${fieldIndex}.newRewardAddress`}
                    label="New reward address"
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const addressErr = validateAddress(value)
                        if (addressErr) {
                          return addressErr
                        }

                        const valueAddress = utils.getAddress(value)

                        const idInAddressMap = rewardAddressesMap[valueAddress]

                        /*
                        Although the specification does not yet state this,
                        according to the code, the new reward address should not match
                        any of the reward addresses of other operator nodes.
                        */
                        if (typeof idInAddressMap === 'number') {
                          return 'Address must not be in use by another node operator'
                        }

                        const addressInSelectedNodeOperatorsIndex =
                          selectedNodeOperators.findIndex(
                            ({ newRewardAddress }, index) =>
                              newRewardAddress &&
                              utils.getAddress(newRewardAddress) ===
                                valueAddress &&
                              fieldIndex !== index,
                          )

                        /*
                        Same as above, each reward address must be unique within the update.
                        */
                        if (addressInSelectedNodeOperatorsIndex !== -1) {
                          return 'Address is already in use by another update'
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

        {selectedNodeOperators.length < nodeOperatorsList.length && (
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
