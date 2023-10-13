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

import {
  ContractSDVTNodeOperatorsDeactivate,
  ContractSDVTRegistry,
} from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { SelectControl } from 'modules/shared/ui/Controls/Select'
import { InputControl } from 'modules/shared/ui/Controls/Input'

type Program = {
  nodeOperatorId: string
  managerAddress: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTNodeOperatorsDeactivate,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedPrograms = formData.programs.sort(
      (a, b) => Number(a.nodeOperatorId) - Number(b.nodeOperatorId),
    )

    const encodedCallData = new utils.AbiCoder().encode(
      ['tuple(uint256 nodeOperatorId, address managerAddress)[]'],
      [
        sortedPrograms.map(program => ({
          nodeOperatorId: Number(program.nodeOperatorId),
          managerAddress: utils.getAddress(program.managerAddress),
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
        managerAddress: '',
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

    const activeNodeOperators = nodeOperatorsList?.filter(
      nodeOperator => nodeOperator.active,
    )

    const sdvtRegistry = ContractSDVTRegistry.useRpc()
    const trustedCaller = ContractSDVTNodeOperatorsDeactivate.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const fieldsArr = useFieldArray({ name: fieldNames.programs })
    const { watch, setValue } = useFormContext()
    const selectedPrograms: Program[] = watch(fieldNames.programs)

    const getFilteredOptions = (fieldIdx: number) => {
      if (!activeNodeOperators?.length) return []
      const selectedIds = selectedPrograms.map(({ nodeOperatorId }) =>
        parseInt(nodeOperatorId),
      )
      const thisId = parseInt(selectedPrograms[fieldIdx]?.nodeOperatorId)
      return activeNodeOperators.filter(
        ({ id }) => !selectedIds.includes(id) || id === thisId,
      )
    }

    const handleAddProgram = () =>
      fieldsArr.append({
        nodeOperatorId: '',
        managerAddress: '',
      })

    const getCanAddressManageKeys = async (
      address: string,
      nodeOperatorId: string,
    ) => {
      const role = await sdvtRegistry.MANAGE_SIGNING_KEYS()
      return sdvtRegistry.canPerform(address, role, [nodeOperatorId])
    }

    if (trustedCaller.initialLoading || isNodeOperatorsDataLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!nodeOperatorsList?.length || !activeNodeOperators?.length) {
      return <MessageBox>There are no node operators to deactivate</MessageBox>
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
                    onChange={(nodeOperatorId: string) => {
                      const nodeOperatorIdNum = Number(nodeOperatorId)
                      const managerAddress =
                        nodeOperatorsList[nodeOperatorIdNum]?.managerAddress

                      if (managerAddress) {
                        const newPrograms = [...selectedPrograms]
                        newPrograms[i].managerAddress = managerAddress
                        setValue(fieldNames.programs, newPrograms)
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
                    name={`${fieldNames.programs}.${i}.managerAddress`}
                    label="Manager Address"
                    disabled={
                      !!nodeOperatorsList[
                        Number(selectedPrograms[i].nodeOperatorId)
                      ].managerAddress
                    }
                    rules={{
                      required: 'Field is required',
                      validate: async value => {
                        if (!utils.isAddress(value))
                          return 'Address is not valid'

                        const canAddressManageKeys =
                          await getCanAddressManageKeys(
                            value,
                            selectedPrograms[i].nodeOperatorId,
                          )

                        if (!canAddressManageKeys) {
                          return 'Address is not allowed to manage signing keys'
                        }
                      },
                    }}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          )
        })}

        {selectedPrograms.length < activeNodeOperators.length && (
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
