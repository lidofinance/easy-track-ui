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
  name: string
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
          name: nodeOperator.name,
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
        name: '',
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

    const nodeOperatorNamesMap = useMemo(
      () =>
        nodeOperatorsList?.reduce((acc, item) => {
          acc[item.name] = item.id
          return acc
        }, {} as Record<string, number | undefined>) ?? {},
      [nodeOperatorsList],
    )

    const getFilteredOptions = (fieldIdx: number) => {
      if (!nodeOperatorsList?.length) return []
      const selectedIds = selectedNodeOperators.map(({ id }) => parseInt(id))
      const thisId = parseInt(selectedNodeOperators[fieldIdx]?.id)
      return nodeOperatorsList.filter(
        ({ id }) => !selectedIds.includes(id) || id === thisId,
      )
    }

    const handleAddUpdate = () =>
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
        {fieldsArr.fields.map((item, i) => (
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
                <InputControl
                  name={`${fieldNames.nodeOperators}.${i}.name`}
                  label="Name"
                  rules={{
                    required: 'Field is required',
                    validate: (value: string) => {
                      const idInNameMap = nodeOperatorNamesMap[value]

                      if (typeof idInNameMap === 'number') {
                        return 'Name must not be in use by another node operator'
                      }

                      const nameInSelectedNodeOperatorsIndex =
                        selectedNodeOperators.findIndex(
                          ({ name }, index) =>
                            name &&
                            name.toLowerCase() === value.toLowerCase() &&
                            i !== index,
                        )

                      if (nameInSelectedNodeOperatorsIndex !== -1) {
                        return 'Name is already in use by another update'
                      }

                      if (maxNodeOperatorNameLength?.lt(value.length)) {
                        return `Name length must be less or equal than ${maxNodeOperatorNameLength} characters`
                      }

                      return true
                    },
                  }}
                />
              </Fieldset>
            </FieldsWrapper>
          </Fragment>
        ))}

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
