import { utils, constants } from 'ethers'

import { Fragment, useCallback, useEffect, useState } from 'react'
import { useFieldArray, useForm, useFormState } from 'react-hook-form'
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
export const formParts = ({}: {
  registryType: typeof MotionTypeForms.SDVTNodeOperatorsAdd
}) =>
  createMotionFormPart({
    motionType: MotionTypeForms.SDVTNodeOperatorsAdd,
    populateTx: async ({ evmScriptFactory, formData, contract }) => {
      const encodedCallData = new utils.AbiCoder().encode(
        ['uint256', 'tuple(string, address, address)[]'],
        [
          Number(formData.nodeOperatorsCount[0]?.count),
          formData.nodeOperators.map(item => [
            item.name,
            utils.getAddress(item.rewardAddress),
            utils.getAddress(item.managerAddress),
          ]),
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
      nodeOperatorsCount: [{ count: '' }] as { count: string }[],
    }),
    Component: function StartNewMotionMotionFormLego({
      fieldNames,
      submitAction,
      getValues,
    }) {
      const { walletAddress } = useWeb3()
      const trustedCaller = ContractSDVTNodeOperatorsAdd.useSwrWeb3(
        'trustedCaller',
        [],
      )
      const isTrustedCallerConnected = trustedCaller.data === walletAddress
      const [hasDuplicateManagers, setHasDuplicateManagers] = useState(false)

      const { data: NONameLength, initialLoading: NONameLengthLoading } =
        useSDVTOperatorNameLimit()
      const { data: NOCounts, initialLoading: maxOperatorsLoading } =
        useSDVTOperatorsCounts()

      const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
      const { update } = useFieldArray({ name: fieldNames.nodeOperatorsCount })
      const { isValid } = useFormState()
      const { setValue } = useForm()

      const contractAragonAcl = ContractAragonAcl.useRpc()
      const sdvtRegistry = ContractSDVTRegistry.useRpc()

      const checkIsAlreadyManager = async (address: string) => {
        const MANAGE_SIGNING_KEYS_ROLE =
          await sdvtRegistry.MANAGE_SIGNING_KEYS()
        const result = await contractAragonAcl.getPermissionParamsLength(
          address,
          sdvtRegistry.address,
          MANAGE_SIGNING_KEYS_ROLE,
        )
        return !result.isZero()
      }

      const checkIsLidoRewardAddress = async (address: string) => {
        const lidoRewardAddress = await sdvtRegistry.getLocator()
        return address === lidoRewardAddress
      }

      useEffect(() => {
        update(0, { count: `${NOCounts?.current}` })
      }, [setValue, fieldNames.nodeOperators, update, NOCounts])

      const handleAddNodeOperators = useCallback(() => {
        const nodeOperators = getValues().SDVTNodeOperatorsAdd
          .nodeOperators as NodeOperator[]
        const managerAddressList = nodeOperators.map(
          item => item.managerAddress,
        )
        const uniqManagerAddressList = Array.from(new Set(managerAddressList))
        if (managerAddressList.length !== uniqManagerAddressList.length) {
          setHasDuplicateManagers(true)
          return
        }
        fieldsArr.append({ name: '', rewardAddress: '', managerAddress: '' })
      }, [fieldsArr, setHasDuplicateManagers, getValues])

      const handleRemoveNodeOperator = useCallback(
        (i: number) => fieldsArr.remove(i),
        [fieldsArr],
      )

      if (
        trustedCaller.initialLoading ||
        NONameLengthLoading ||
        maxOperatorsLoading
      ) {
        return <PageLoader />
      }

      if (!isTrustedCallerConnected) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        )
      }

      return (
        <>
          {fieldsArr.fields.map((item, i) => (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <FieldsHeaderDesc>NodeOperator #{i + 1}</FieldsHeaderDesc>
                  )}
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => handleRemoveNodeOperator(i)}
                    >
                      Remove node operator {i + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <InputControl
                    label="Name"
                    name={`${fieldNames.nodeOperators}.${i}.name`}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        if (!NONameLength || value?.length > NONameLength)
                          return 'Name is too long'
                        return true
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputControl
                    label="Reward address"
                    name={`${fieldNames.nodeOperators}.${i}.rewardAddress`}
                    rules={{
                      required: 'Field is required',
                      validate: async value => {
                        if (!utils.isAddress(value)) {
                          return 'Address is not valid'
                        }
                        if (value === constants.AddressZero) {
                          return 'Should not be zero address'
                        }
                        const isLidoRewardAddress =
                          await checkIsLidoRewardAddress(value)
                        if (isLidoRewardAddress) {
                          return 'Address is LIDO reward address'
                        }
                        return true
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputControl
                    label={`Manager address`}
                    name={`${fieldNames.nodeOperators}.${i}.managerAddress`}
                    rules={{
                      required: 'Field is required',
                      validate: async value => {
                        if (!utils.isAddress(value)) {
                          return 'Address is not valid'
                        }
                        const isAlreadyManager = await checkIsAlreadyManager(
                          value,
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
          {hasDuplicateManagers && (
            <ErrorBox>
              Different node operators can&apos;t have same manager address
            </ErrorBox>
          )}
          {isValid &&
            NOCounts &&
            NOCounts.max > fieldsArr.fields.length + NOCounts.current && (
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
