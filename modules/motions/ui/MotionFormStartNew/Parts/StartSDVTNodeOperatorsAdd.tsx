import { utils } from 'ethers'

import { Fragment, useEffect, useMemo } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, ButtonIcon } from '@lidofinance/lido-ui'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  ErrorBox,
} from '../CreateMotionFormStyle'

import {
  ContractAragonAcl,
  ContractSDVTNodeOperatorsAdd,
  ContractSDVTRegistry,
} from 'modules/blockChain/contracts'

import { MotionTypeForms } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import {
  useSDVTOperatorNameLimit,
  useSDVTOperatorsCounts,
} from 'modules/motions/hooks'
import { STETH } from 'modules/blockChain/contractAddresses'
import { checkAddressForManageSigningKeysRole } from 'modules/motions/utils/checkAddressManagerRole'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { validateNodeOperatorName } from 'modules/motions/utils/validateNodeOperatorName'
import { validateAddress } from 'modules/motions/utils/validateAddress'

type NodeOperator = {
  name: string
  rewardAddress: string
  managerAddress: string
}

// DONE: The current number of node operators in the registry MUST be equal to the _nodeOperatorsCount
// DONE: (exec also) The total number of node operators in the registry, after adding the new ones, MUST NOT exceed nodeOperatorsRegistry.MAX_NODE_OPERATORS_COUNT()
// DONE: Manager addresses MUST NOT have duplicates
// DONE: Manager addresses MUST NOT be used as managers for previously added node operators
// DONE: Reward addresses of newly added node operators MUST NOT contain the address of the stETH token
// DONE: Reward addresses of newly added node operators MUST NOT contain zero addresses
// DONE: The names of newly added node operators MUST NOT be an empty string
// DONE: The name lengths of each newly added node operator MUST NOT exceed the nodeOperatorsRegistry.MAX_NODE_OPERATOR_NAME_LENGTH()
export const formParts = () =>
  createMotionFormPart({
    motionType: MotionTypeForms.SDVTNodeOperatorsAdd,
    populateTx: async ({ evmScriptFactory, formData, contract }) => {
      const encodedCallData = new utils.AbiCoder().encode(
        [
          'uint256 nodeOperatorsCount',
          'tuple(string name, address rewardAddress, address managerAddress)[]',
        ],
        [
          formData.nodeOperatorsCount,
          formData.nodeOperators.map(item => ({
            name: item.name,
            rewardAddress: utils.getAddress(item.rewardAddress),
            managerAddress: utils.getAddress(item.managerAddress),
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
        { name: '', rewardAddress: '', managerAddress: '' },
      ] as NodeOperator[],
      nodeOperatorsCount: NaN,
    }),
    Component: ({ fieldNames, submitAction }) => {
      const { setValue, watch } = useFormContext()
      const { walletAddress, chainId } = useWeb3()
      const trustedCaller = ContractSDVTNodeOperatorsAdd.useSwrWeb3(
        'trustedCaller',
        [],
      )
      const sdvtRegistry = ContractSDVTRegistry.useRpc()
      const aragonAcl = ContractAragonAcl.useRpc()
      const isTrustedCallerConnected = trustedCaller.data === walletAddress

      const {
        data: nodeOperatorsList,
        initialLoading: isNodeOperatorsListLoading,
      } = useSDVTNodeOperatorsList()
      const {
        data: maxNodeOperatorNameLength,
        initialLoading: NONameLengthLoading,
      } = useSDVTOperatorNameLimit()
      const { data: NOCounts, initialLoading: maxOperatorsLoading } =
        useSDVTOperatorsCounts()

      const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
      const selectedNodeOperators: NodeOperator[] = watch(
        fieldNames.nodeOperators,
      )

      useEffect(() => {
        if (typeof NOCounts?.current === 'number') {
          setValue(fieldNames.nodeOperatorsCount, NOCounts.current)
        }
      }, [setValue, NOCounts, fieldNames.nodeOperatorsCount])

      const nodeOperatorsDetailsMaps = useMemo(() => {
        const result: Record<
          'name' | 'rewardAddress' | 'managerAddress',
          Record<string, number | undefined>
        > = { name: {}, rewardAddress: {}, managerAddress: {} }
        if (!nodeOperatorsList) return result

        for (const nodeOperator of nodeOperatorsList) {
          result['name'][nodeOperator.name] = nodeOperator.id
          result['rewardAddress'][nodeOperator.rewardAddress] = nodeOperator.id
          if (nodeOperator.managerAddress) {
            result['managerAddress'][nodeOperator.managerAddress] =
              nodeOperator.id
          }
        }

        return result
      }, [nodeOperatorsList])

      const handleAddNodeOperators = () =>
        fieldsArr.append({
          name: '',
          rewardAddress: '',
          managerAddress: '',
        } as NodeOperator)

      const handleRemoveNodeOperator = (fieldIndex: number) =>
        fieldsArr.remove(fieldIndex)

      if (
        trustedCaller.initialLoading ||
        NONameLengthLoading ||
        maxOperatorsLoading ||
        isNodeOperatorsListLoading
      ) {
        return <PageLoader />
      }

      if (!isTrustedCallerConnected) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        )
      }

      if (!NOCounts) {
        return <ErrorBox>Cannot load node operators count data</ErrorBox>
      }

      if (NOCounts.current >= NOCounts.max) {
        return <MessageBox>Node operators limit reached</MessageBox>
      }

      return (
        <>
          {fieldsArr.fields.map((item, fieldIndex) => (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <FieldsHeaderDesc>
                      NodeOperator #{NOCounts.current + fieldIndex}
                    </FieldsHeaderDesc>
                  )}
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => handleRemoveNodeOperator(fieldIndex)}
                    >
                      Remove node operator {NOCounts.current + fieldIndex}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <InputControl
                    label="Name"
                    name={`${fieldNames.nodeOperators}.${fieldIndex}.name`}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const nameErr = validateNodeOperatorName(
                          value,
                          maxNodeOperatorNameLength,
                        )
                        if (nameErr) {
                          return nameErr
                        }

                        const idInNameMap =
                          nodeOperatorsDetailsMaps['name'][value]

                        if (typeof idInNameMap === 'number') {
                          return 'Name must not be in use by another node operator'
                        }

                        const nameInSelectedNodeOperatorsIndex =
                          selectedNodeOperators.findIndex(
                            ({ name }, index) =>
                              name.toLowerCase() === value.toLowerCase() &&
                              fieldIndex !== index,
                          )

                        if (nameInSelectedNodeOperatorsIndex !== -1) {
                          return 'Name is already in use by another update'
                        }

                        return true
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputControl
                    label="Reward address"
                    name={`${fieldNames.nodeOperators}.${fieldIndex}.rewardAddress`}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const addressErr = validateAddress(value)
                        if (addressErr) {
                          return addressErr
                        }

                        const valueAddress = utils.getAddress(value)
                        const stETHAddress = STETH[chainId]

                        if (
                          stETHAddress &&
                          valueAddress === utils.getAddress(stETHAddress)
                        ) {
                          return 'Address must not be stETH address'
                        }

                        const idInAddressMap =
                          nodeOperatorsDetailsMaps['rewardAddress'][
                            valueAddress
                          ]

                        if (typeof idInAddressMap === 'number') {
                          return 'Address must not be in use by another node operator'
                        }

                        const addressInSelectedNodeOperatorsIndex =
                          selectedNodeOperators.findIndex(
                            ({ rewardAddress }, index) =>
                              rewardAddress &&
                              utils.getAddress(rewardAddress) ===
                                valueAddress &&
                              fieldIndex !== index,
                          )

                        if (addressInSelectedNodeOperatorsIndex !== -1) {
                          return 'Address is already in use by another update'
                        }

                        return true
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputControl
                    label={`Manager address`}
                    name={`${fieldNames.nodeOperators}.${fieldIndex}.managerAddress`}
                    rules={{
                      required: 'Field is required',
                      validate: async value => {
                        const addressErr = validateAddress(value)
                        if (addressErr) {
                          return addressErr
                        }

                        const valueAddress = utils.getAddress(value)
                        const idInAddressMap =
                          nodeOperatorsDetailsMaps['managerAddress'][
                            valueAddress
                          ]

                        if (typeof idInAddressMap === 'number') {
                          return 'Address must not be in use by another node operator'
                        }

                        const addressInSelectedNodeOperatorsIndex =
                          selectedNodeOperators.findIndex(
                            ({ managerAddress }, index) =>
                              managerAddress &&
                              utils.getAddress(managerAddress) ===
                                valueAddress &&
                              fieldIndex !== index,
                          )

                        if (addressInSelectedNodeOperatorsIndex !== -1) {
                          return 'Address is already in use by another update'
                        }

                        const isAlreadyManager =
                          await checkAddressForManageSigningKeysRole(
                            value,
                            sdvtRegistry,
                            aragonAcl,
                          )

                        if (isAlreadyManager) {
                          return 'Address already has a signing keys manager role'
                        }
                        return true
                      },
                    }}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          ))}
          {NOCounts.max > fieldsArr.fields.length + NOCounts.current && (
            <Fieldset>
              <ButtonIcon
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddNodeOperators}
                icon={<Plus />}
                color="secondary"
              >
                One more node operator
              </ButtonIcon>
            </Fieldset>
          )}

          {submitAction}
        </>
      )
    },
  })
