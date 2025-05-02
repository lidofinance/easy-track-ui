import { BigNumber, utils } from 'ethers'

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

import { ContractSDVTTargetValidatorLimitsUpdateV2 } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { validateUintValue } from 'modules/motions/utils/validateUintValue'
import { NodeOperatorSelectControl } from 'modules/motions/ui/NodeOperatorSelectControl'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { useSDVTNodeOperatorsSummaryMap } from 'modules/motions/hooks/useSDVTNodeOperatorsSummary'

type NodeOperator = {
  id: number | undefined
  targetLimitMode: string
  targetLimit: string
}

const UINT_64_MAX = BigNumber.from('0xFFFFFFFFFFFFFFFF')

const TARGET_LIMIT_MODES: Partial<Record<string, string>> = {
  '0': 'Disabled',
  '1': 'Soft limit',
  '2': 'Boosted exits',
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTTargetValidatorLimitsUpdateV2,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedNodeOperators = formData.nodeOperators.sort(
      (a, b) => Number(a.id) - Number(b.id),
    )

    const encodedCallData = new utils.AbiCoder().encode(
      [
        'tuple(uint256 nodeOperatorId, uint256 targetLimitMode, uint256 targetLimit)[]',
      ],
      [
        sortedNodeOperators.map(nodeOperator => ({
          nodeOperatorId: Number(nodeOperator.id),
          targetLimitMode: Number(nodeOperator.targetLimitMode),
          targetLimit: Number(nodeOperator.targetLimit),
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
        id: undefined,
        targetLimitMode: '',
        targetLimit: '',
      },
    ] as NodeOperator[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()
    const {
      data: nodeOperatorsList,
      initialLoading: isNodeOperatorsDataLoading,
    } = useSDVTNodeOperatorsList()
    const {
      data: operatorsSummaryMap,
      initialLoading: isNodeOperatorsSummaryLoading,
    } = useSDVTNodeOperatorsSummaryMap()

    const trustedCaller = ContractSDVTTargetValidatorLimitsUpdateV2.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
    const { watch, setError } = useFormContext()

    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    )

    const getFilteredOptions = (fieldIdx: number) => {
      if (!nodeOperatorsList?.length) {
        return []
      }

      const selectedIds = selectedNodeOperators.map(({ id }) => id)
      const thisId = selectedNodeOperators[fieldIdx]?.id
      return nodeOperatorsList.filter(
        ({ id }) => !selectedIds.includes(id) || id === thisId,
      )
    }

    const handleAddUpdate = () =>
      fieldsArr.append({
        id: undefined,
        targetLimitMode: '',
        targetLimit: '',
      } as NodeOperator)

    if (
      trustedCaller.initialLoading ||
      isNodeOperatorsDataLoading ||
      isNodeOperatorsSummaryLoading
    ) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!nodeOperatorsList?.length || !operatorsSummaryMap) {
      return <MessageBox>Node operator list is empty</MessageBox>
    }

    return (
      <>
        {fieldsArr.fields.map((item, fieldIndex) => {
          const currentNodeOperator =
            selectedNodeOperators[fieldIndex].id &&
            nodeOperatorsList[selectedNodeOperators[fieldIndex].id!]

          const currentTargetLimitMode =
            currentNodeOperator &&
            operatorsSummaryMap[
              currentNodeOperator.id
            ].targetLimitMode.toString()

          const targetLimitModeLabel = currentTargetLimitMode
            ? TARGET_LIMIT_MODES[currentTargetLimitMode]
            : null

          const currentTargetLimit =
            currentNodeOperator &&
            operatorsSummaryMap[
              currentNodeOperator.id
            ].targetValidatorsCount.toString()

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
                      const nodeOperatorSummary =
                        operatorsSummaryMap[nodeOperator.id]

                      fieldsArr.update(fieldIndex, {
                        targetLimitMode:
                          nodeOperatorSummary.targetLimitMode.toString(),
                        targetLimit:
                          nodeOperatorSummary.targetValidatorsCount.toString(),
                      })
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <SelectControl
                    name={`${fieldNames.nodeOperators}.${fieldIndex}.targetLimitMode`}
                    label={`Target limit mode ${
                      targetLimitModeLabel
                        ? ` (current mode is ${targetLimitModeLabel})`
                        : ''
                    }`}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const currentMode = Number(currentTargetLimitMode)
                        const modeToUpdate = Number(value)

                        const currentLimit = Number(currentTargetLimit)
                        const limitToUpdate = Number(
                          selectedNodeOperators[fieldIndex].targetLimit,
                        )

                        if (
                          modeToUpdate !== currentMode &&
                          currentLimit === limitToUpdate
                        ) {
                          setError(
                            `${fieldNames.nodeOperators}.${fieldIndex}.targetLimit`,
                            { message: undefined },
                          )
                          return true
                        }

                        return true
                      },
                    }}
                  >
                    {Object.entries(TARGET_LIMIT_MODES).map(([key, value]) => (
                      <Option key={key} value={key}>
                        {value!}
                      </Option>
                    ))}
                  </SelectControl>
                </Fieldset>

                <Fieldset>
                  <InputNumberControl
                    name={`${fieldNames.nodeOperators}.${fieldIndex}.targetLimit`}
                    label={`New limit ${
                      currentTargetLimit
                        ? ` (current limit is ${currentTargetLimit})`
                        : ''
                    }`}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const uintError = validateUintValue(value)
                        if (uintError) {
                          return uintError
                        }

                        if (UINT_64_MAX.lt(value)) {
                          return `Value must be less than or equal to ${UINT_64_MAX}`
                        }

                        const currentMode = Number(currentTargetLimitMode)
                        const modeToUpdate = Number(
                          selectedNodeOperators[fieldIndex].targetLimitMode,
                        )

                        const currentLimit = Number(currentTargetLimit)
                        const limitToUpdate = Number(value)

                        if (
                          currentMode === modeToUpdate &&
                          currentLimit === limitToUpdate
                        ) {
                          return 'Both mode and limit are the same as current'
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
