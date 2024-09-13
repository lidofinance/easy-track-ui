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

import { ContractCSMSettleElStealingPenalty } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useCSMNodeOperatorsCount } from 'modules/motions/hooks/useCSMNodeOperatorsCount'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { validateUintValue } from 'modules/motions/utils/validateUintValue'

type NodeOperator = {
  id: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.CSMSettleElStealingPenalty,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedNodeOperators = formData.nodeOperators
      .map(({ id }) => Number(id))
      .sort((a, b) => a - b)

    const encodedCallData = new utils.AbiCoder().encode(
      ['uint256[]'],
      [sortedNodeOperators],
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
      },
    ] as NodeOperator[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()

    const {
      data: nodeOperatorsCount,
      initialLoading: isNodeOperatorsCountLoading,
    } = useCSMNodeOperatorsCount()

    const trustedCaller = ContractCSMSettleElStealingPenalty.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
    const { watch } = useFormContext()
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    )

    const handleAddSettle = () =>
      fieldsArr.append({
        id: '',
      } as NodeOperator)

    if (trustedCaller.initialLoading || isNodeOperatorsCountLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!nodeOperatorsCount) {
      return <MessageBox>There are no node operators</MessageBox>
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
                      Settle #{fieldIndex + 1}
                    </FieldsHeaderDesc>
                  )}
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => fieldsArr.remove(fieldIndex)}
                    >
                      Remove settle {fieldIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <InputNumberControl
                    name={`${fieldNames.nodeOperators}.${fieldIndex}.nodeOperatorId`}
                    label="Node operator ID"
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const uintError = validateUintValue(value)
                        if (uintError) {
                          return uintError
                        }
                        const valueNum = Number(value)

                        if (valueNum >= nodeOperatorsCount) {
                          return 'Invalid node operator ID'
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

        {selectedNodeOperators.length < nodeOperatorsCount && (
          <Fieldset>
            <ButtonIcon
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddSettle}
              icon={<Plus />}
              color="secondary"
            >
              One more settle
            </ButtonIcon>
          </Fieldset>
        )}

        {submitAction}
      </>
    )
  },
})
