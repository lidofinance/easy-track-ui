import { utils } from 'ethers'

import { Fragment } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
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

type Program = {
  nodeOperatorId: string
  vettedValidatorsLimit: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTVettedValidatorsLimitsSet,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedPrograms = formData.programs.sort(
      (a, b) => Number(a.nodeOperatorId) - Number(b.nodeOperatorId),
    )

    const encodedCallData = new utils.AbiCoder().encode(
      ['tuple(uint256 nodeOperatorId, uint256 stakingLimit)[]'],
      [
        sortedPrograms.map(program => ({
          nodeOperatorId: Number(program.nodeOperatorId),
          managerAddress: Number(program.vettedValidatorsLimit),
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
    programs: [
      {
        nodeOperatorId: '',
        vettedValidatorsLimit: '',
      },
    ] as Program[],
  }),
  Component: function StartNewMotionMotionFormLego({
    fieldNames,
    submitAction,
  }) {
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

    const fieldsArr = useFieldArray({ name: fieldNames.programs })
    const { watch } = useFormContext()
    const selectedPrograms: Program[] = watch(fieldNames.programs)

    const getFilteredOptions = (fieldIdx: number) => {
      if (!nodeOperatorsList?.length) return []
      const selectedIds = selectedPrograms.map(({ nodeOperatorId }) =>
        parseInt(nodeOperatorId),
      )
      const thisId = parseInt(selectedPrograms[fieldIdx]?.nodeOperatorId)
      return nodeOperatorsList.filter(
        ({ id }) => !selectedIds.includes(id) || id === thisId,
      )
    }

    const handleAddProgram = () =>
      fieldsArr.append({
        nodeOperatorId: '',
        managerAddress: '',
      })

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
                    <FieldsHeaderDesc>Program #{i + 1}</FieldsHeaderDesc>
                  )}
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton onClick={() => fieldsArr.remove(i)}>
                      Remove program {i + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <SelectControl
                    label="Node Operator"
                    name={`${fieldNames.programs}.${i}.nodeOperatorId`}
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
                    label="Vetted Validators Limit"
                    name={`${fieldNames.programs}.${i}.vettedValidatorsLimit`}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const check1 = validateToken(value)
                        if (typeof check1 === 'string') {
                          return check1
                        }

                        const totalValidatorsCount =
                          nodeOperatorsList[
                            Number(selectedPrograms[i].nodeOperatorId)
                          ].totalAddedValidators

                        if (totalValidatorsCount.lt(value)) {
                          return `Value should be less than ${totalValidatorsCount.toString()}`
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

        {selectedPrograms.length < nodeOperatorsList.length && (
          <Fieldset>
            <ButtonIcon
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddProgram}
              icon={<Plus />}
              color="secondary"
            >
              One more program
            </ButtonIcon>
          </Fieldset>
        )}

        {submitAction}
      </>
    )
  },
})
