import { utils } from 'ethers'

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

import { ContractSDVTNodeOperatorNamesSet } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { SelectControl } from 'modules/shared/ui/Controls/Select'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { useSDVTOperatorNameLimit } from 'modules/motions/hooks'

type NodeOperator = {
  id: string
  newName: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTNodeOperatorNamesSet,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedNodeOperators = formData.nodeOperators.sort(
      (a, b) => Number(a.id) - Number(b.id),
    )

    const encodedCallData = new utils.AbiCoder().encode(
      ['tuple(uint256 nodeOperatorId, string name)[]'],
      [
        sortedNodeOperators.map(nodeOperator => ({
          nodeOperatorId: Number(nodeOperator.id),
          name: nodeOperator.newName,
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
        newName: '',
      },
    ] as NodeOperator[],
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

    const {
      data: maxNodeOperatorNameLength,
      initialLoading: isNodeOperatorMaxNameLengthLoading,
    } = useSDVTOperatorNameLimit()

    const trustedCaller = ContractSDVTNodeOperatorNamesSet.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
    const { isValid } = useFormState()

    const { watch } = useFormContext()
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    )

    const nodeOperatorNamesMap = useMemo(() => {
      const result: Record<number, string | undefined> = {}

      if (nodeOperatorsList?.length) {
        for (const nodeOperator of nodeOperatorsList) {
          result[nodeOperator.id] = nodeOperator.name
        }
      }

      for (const nodeOperator of selectedNodeOperators) {
        result[parseInt(nodeOperator.id)] = nodeOperator.newName
      }

      const invertedRecord: Record<string, number | undefined> = {}
      for (const key in result) {
        if (result.hasOwnProperty(key)) {
          const value = result[key]
          if (value) {
            invertedRecord[value] = parseInt(key)
          }
        }
      }

      return invertedRecord
    }, [nodeOperatorsList, selectedNodeOperators])

    const getFilteredOptions = (fieldIdx: number) => {
      if (!nodeOperatorsList?.length) return []
      const selectedIds = selectedNodeOperators.map(({ id }) => parseInt(id))
      const thisId = parseInt(selectedNodeOperators[fieldIdx]?.id)
      return nodeOperatorsList.filter(
        ({ id }) => !selectedIds.includes(id) || id === thisId,
      )
    }

    const handleAddNodeOperator = () =>
      fieldsArr.append({
        nodeOperatorId: '',
        name: '',
      })

    if (
      trustedCaller.initialLoading ||
      isNodeOperatorsDataLoading ||
      isNodeOperatorMaxNameLengthLoading
    ) {
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
          const isFieldDisabled = i !== fieldsArr.fields.length - 1
          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <FieldsHeaderDesc>Node Operator #{i + 1}</FieldsHeaderDesc>
                  )}
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton onClick={() => fieldsArr.remove(i)}>
                      Remove Node Operator {i + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <SelectControl
                    label="Node Operator"
                    name={`${fieldNames.nodeOperators}.${i}.id`}
                    rules={{ required: 'Field is required' }}
                    disabled={isFieldDisabled}
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
                    name={`${fieldNames.nodeOperators}.${i}.newName`}
                    label="New Name"
                    disabled={isFieldDisabled}
                    rules={{
                      required: 'Field is required',
                      validate: (value: string | undefined) => {
                        if (!value?.length) {
                          return 'Field is required'
                        }
                        const currentId = Number(selectedNodeOperators[i].id)

                        const nodeOperator = nodeOperatorsList[currentId]

                        const oldName = nodeOperator.name

                        if (value === oldName) {
                          return 'Name must be different from the old one'
                        }

                        const idInNameMap = nodeOperatorNamesMap[value]

                        if (
                          typeof idInNameMap === 'number' &&
                          idInNameMap !== currentId
                        ) {
                          return 'Name must be unique'
                        }

                        if (maxNodeOperatorNameLength?.lt(value.length)) {
                          return `Name must be less than ${maxNodeOperatorNameLength.toString()} characters`
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
              onClick={handleAddNodeOperator}
              icon={<Plus />}
              color="secondary"
            >
              One more Node Operator
            </ButtonIcon>
          </Fieldset>
        )}

        {submitAction}
      </>
    )
  },
})
