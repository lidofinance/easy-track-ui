import { BigNumber, utils } from 'ethers'

import { ChangeEvent, Fragment } from 'react'
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

import { ContractSDVTTargetValidatorLimitsUpdate } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { SelectControl } from 'modules/shared/ui/Controls/Select'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { CheckboxControl } from 'modules/shared/ui/Controls/Checkbox'
import { validateUintValue } from 'modules/motions/utils/validateUintValue'

type NodeOperator = {
  id: string
  isTargetLimitActive: boolean
  targetLimit: string
}

const UINT_64_MAX = BigNumber.from('0xFFFFFFFFFFFFFFFF')

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTTargetValidatorLimitsUpdate,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedNodeOperators = formData.nodeOperators.sort(
      (a, b) => Number(a.id) - Number(b.id),
    )

    const encodedCallData = new utils.AbiCoder().encode(
      [
        'tuple(uint256 nodeOperatorId, bool isTargetLimitActive, uint256 targetLimit)[]',
      ],
      [
        sortedNodeOperators.map(nodeOperator => ({
          nodeOperatorId: Number(nodeOperator.id),
          isTargetLimitActive: nodeOperator.isTargetLimitActive,
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
        id: '',
        isTargetLimitActive: false,
        targetLimit: '',
      },
    ] as NodeOperator[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()
    const {
      data: nodeOperatorsList,
      initialLoading: isNodeOperatorsDataLoading,
    } = useSDVTNodeOperatorsList({ withSummary: true })

    const trustedCaller = ContractSDVTTargetValidatorLimitsUpdate.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
    const { watch, setValue } = useFormContext()
    const { isValid } = useFormState()
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
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
        isTargetLimitActive: false,
        targetLimit: '',
      } as NodeOperator)

    if (trustedCaller.initialLoading || isNodeOperatorsDataLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!nodeOperatorsList?.length) {
      return <MessageBox>Node operator list is empty</MessageBox>
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
                    label="Node operator"
                    name={`${fieldNames.nodeOperators}.${i}.id`}
                    rules={{ required: 'Field is required' }}
                    onChange={(value: string) => {
                      const nodeOperator = nodeOperatorsList[Number(value)]

                      fieldsArr.update(i, {
                        isTargetLimitActive:
                          nodeOperator.isTargetLimitActive ?? false,
                        targetLimit:
                          nodeOperator.targetValidatorsCount?.toString() ?? '',
                      })
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
                  <CheckboxControl
                    label="Target validator limit active"
                    name={`${fieldNames.nodeOperators}.${i}.isTargetLimitActive`}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      if (event.target.checked === false) {
                        setValue(
                          `${fieldNames.nodeOperators}.${i}.targetLimit`,
                          '0',
                        )
                      }
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputControl
                    name={`${fieldNames.nodeOperators}.${i}.targetLimit`}
                    label="Target validator limit"
                    disabled={!selectedNodeOperators[i]?.isTargetLimitActive}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const uintError = validateUintValue(value)
                        if (uintError) {
                          return uintError
                        }

                        if (UINT_64_MAX.lt(value)) {
                          return `Value must be less or equal than ${UINT_64_MAX}`
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
