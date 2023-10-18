import { utils } from 'ethers'

import { Fragment } from 'react'
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

import { ContractSDVTVettedValidatorsLimitsSet } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { SelectControl } from 'modules/shared/ui/Controls/Select'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { validateToken } from 'modules/tokens/utils/validateToken'

type NodeOperator = {
  id: string
  vettedValidatorsLimit: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTVettedValidatorsLimitsSet,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedNodeOperators = formData.nodeOperators.sort(
      (a, b) => Number(a.id) - Number(b.id),
    )

    const encodedCallData = new utils.AbiCoder().encode(
      ['tuple(uint256 nodeOperatorId, uint256 stakingLimit)[]'],
      [
        sortedNodeOperators.map(nodeOperator => ({
          nodeOperatorId: Number(nodeOperator.id),
          stakingLimit: Number(nodeOperator.vettedValidatorsLimit),
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
        vettedValidatorsLimit: '',
      },
    ] as NodeOperator[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()
    const {
      data: nodeOperatorsList,
      initialLoading: isNodeOperatorsDataLoading,
    } = useSDVTNodeOperatorsList()

    const nodeOperatorsWithValidators = nodeOperatorsList?.filter(
      nodeOperator => nodeOperator.totalAddedValidators.gt(0),
    )

    const trustedCaller = ContractSDVTVettedValidatorsLimitsSet.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
    const { watch } = useFormContext()
    const { isValid } = useFormState()
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    )

    const getFilteredOptions = (fieldIdx: number) => {
      if (!nodeOperatorsWithValidators?.length) return []
      const selectedIds = selectedNodeOperators.map(({ id }) => parseInt(id))
      const thisId = parseInt(selectedNodeOperators[fieldIdx]?.id)
      return nodeOperatorsWithValidators.filter(
        ({ id }) => !selectedIds.includes(id) || id === thisId,
      )
    }

    const handleAddProgram = () =>
      fieldsArr.append({
        id: '',
        vettedValidatorsLimit: '',
      } as NodeOperator)

    if (trustedCaller.initialLoading || isNodeOperatorsDataLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!nodeOperatorsList?.length || !nodeOperatorsWithValidators?.length) {
      return (
        <MessageBox>There are no node operators with validators yet</MessageBox>
      )
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
                  <InputNumberControl
                    label="Vetted validators limit"
                    name={`${fieldNames.nodeOperators}.${i}.vettedValidatorsLimit`}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const check1 = validateToken(value)
                        if (typeof check1 === 'string') {
                          return check1
                        }

                        const totalValidatorsCount =
                          nodeOperatorsList[Number(selectedNodeOperators[i].id)]
                            .totalAddedValidators

                        if (totalValidatorsCount.lt(value)) {
                          return `Value must be less or equal than ${totalValidatorsCount}`
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

        {selectedNodeOperators.length < nodeOperatorsWithValidators.length &&
          isValid && (
            <Fieldset>
              <ButtonIcon
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddProgram}
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
