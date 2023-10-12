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
  ContractSDVTNodeOperatorsActivate,
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
  motionType: MotionType.SDVTNodeOperatorsActivate,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['uint256', 'address'],
      [
        formData.programs.map(program => Number(program.nodeOperatorId)),
        formData.programs.map(program =>
          utils.getAddress(program.managerAddress),
        ),
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
    const deactivatedNodeOperatorsList = nodeOperatorsList?.filter(
      nodeOperator => !nodeOperator.active,
    )
    const sdvtRegistry = ContractSDVTRegistry.useRpc()
    const trustedCaller = ContractSDVTNodeOperatorsActivate.useSwrWeb3(
      'trustedCaller',
      [],
    )
    const isTrustedCallerConnected = trustedCaller.data === walletAddress

    const fieldsArr = useFieldArray({ name: fieldNames.programs })
    const { watch, setValue } = useFormContext()
    const selectedPrograms: Program[] = watch(fieldNames.programs)

    const handleAddProgram = () =>
      fieldsArr.append({
        nodeOperatorId: '',
        managerAddress: '',
      })

    const handleRemoveProgram = (i: number) => fieldsArr.remove(i)

    const isManagerAddressValid = async (
      address: string,
      nodeOperatorId: string,
    ) => {
      const role = await sdvtRegistry.MANAGE_SIGNING_KEYS()
      return sdvtRegistry.canPerform(address, role, [nodeOperatorId])
    }

    if (trustedCaller.initialLoading || isNodeOperatorsDataLoading) {
      return <PageLoader />
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!deactivatedNodeOperatorsList?.length) {
      return <MessageBox>There are no node operators to activate</MessageBox>
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
                    <RemoveItemButton onClick={() => handleRemoveProgram(i)}>
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
                        deactivatedNodeOperatorsList[nodeOperatorIdNum]
                          ?.managerAddress

                      if (managerAddress) {
                        const newPrograms = [...selectedPrograms]
                        newPrograms[i].managerAddress = managerAddress
                        setValue(fieldNames.programs, newPrograms)
                      }
                    }}
                  >
                    {deactivatedNodeOperatorsList.map(nodeOperator => (
                      <Option
                        key={nodeOperator.id}
                        value={nodeOperator.id}
                        children={`${nodeOperator.id}: ${nodeOperator.name}`}
                      />
                    ))}
                  </SelectControl>
                </Fieldset>

                <Fieldset>
                  <InputControl
                    name={`${fieldNames.programs}.${i}.managerAddress`}
                    label="Manager Address"
                    // readOnly
                    rules={{
                      required: 'Field is required',
                      validate: async value => {
                        if (!utils.isAddress(value))
                          return 'Address is not valid'

                        const isManagerAddress = await isManagerAddressValid(
                          value,
                          selectedPrograms[i].nodeOperatorId,
                        )

                        if (!isManagerAddress) {
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

        {submitAction}
      </>
    )
  },
})
