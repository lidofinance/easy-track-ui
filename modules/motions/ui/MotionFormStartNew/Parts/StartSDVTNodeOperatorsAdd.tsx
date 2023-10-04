import { utils, constants } from 'ethers'

import { Fragment, useCallback, useState } from 'react'
import { useFieldArray, useFormState } from 'react-hook-form'
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

import { ContractSDVTNodeOperatorsAdd } from 'modules/blockChain/contracts'
import { MotionTypeForms } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'

type NodeOperator = {
  name: string
  rewardAddress: string
  managerAddress: string
}

export const ALLOWED_SDVT_NODE_OPERATORS_ADD_MAP = {
  [MotionTypeForms.SDVTNodeOperatorsAdd]: {
    evmContract: ContractSDVTNodeOperatorsAdd,
    motionType: MotionTypeForms.SDVTNodeOperatorsAdd,
  },
}

// TODO: The current number of node operators in the registry MUST be equal to the _nodeOperatorsCount
// TODO: The total number of node operators in the registry, after adding the new ones, MUST NOT exceed nodeOperatorsRegistry.MAX_NODE_OPERATORS_COUNT()
// DONE: Manager addresses MUST NOT have duplicates
// TODO: Manager addresses MUST NOT be used as managers for previously added node operators
// TODO: Reward addresses of newly added node operators MUST NOT contain the address of the stETH token
// DONE: Reward addresses of newly added node operators MUST NOT contain zero addresses
// DONE: The names of newly added node operators MUST NOT be an empty string
// TODO: The name lengths of each newly added node operator MUST NOT exceed the nodeOperatorsRegistry.MAX_NODE_OPERATOR_NAME_LENGTH()
export const formParts = ({
  registryType,
}: {
  registryType: keyof typeof ALLOWED_SDVT_NODE_OPERATORS_ADD_MAP
}) =>
  createMotionFormPart({
    motionType: ALLOWED_SDVT_NODE_OPERATORS_ADD_MAP[registryType].motionType,
    populateTx: async ({ evmScriptFactory, formData, contract }) => {
      const encodedCallData = new utils.AbiCoder().encode(
        ['uint256', 'tuple(string, address, address)[]'],
        [
          formData.nodeOperators.length,
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
    }),
    Component: function StartNewMotionMotionFormLego({
      fieldNames,
      submitAction,
      getValues,
    }) {
      const { walletAddress } = useWeb3()
      const trustedCaller = ALLOWED_SDVT_NODE_OPERATORS_ADD_MAP[
        registryType
      ].evmContract.useSwrWeb3('trustedCaller', [])
      const isTrustedCallerConnected = trustedCaller.data === walletAddress
      const [hasDuplicateManagers, setHasDuplicateManagers] = useState(false)
      // const { data: periodLimitsData, initialLoading: periodLimitsLoading } =
      //   usePeriodLimitsData({ registryType })
      // const token = useTokenByTopUpType({ registryType })

      const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators })
      const { isValid } = useFormState()

      const handleAddNodeOperator = useCallback(() => {
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

      // const { watch, setValue } = useFormContext()

      if (
        trustedCaller.initialLoading
        // || periodLimitsLoading
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
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputControl
                    label="Reward address"
                    name={`${fieldNames.nodeOperators}.${i}.rewardAddress`}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        if (!utils.isAddress(value))
                          return 'Address is not valid'
                        if (value === constants.AddressZero)
                          return 'Should not be zero address'
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
                      validate: value => {
                        if (!utils.isAddress(value))
                          return 'Address is not valid'
                        console.log(fieldsArr.fields)
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
          {isValid && (
            <Fieldset>
              <ButtonIcon
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddNodeOperator}
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
