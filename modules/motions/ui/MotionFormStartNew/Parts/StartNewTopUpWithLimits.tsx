import { utils } from 'ethers'

import { Fragment, useCallback, useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, ButtonIcon } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  usePeriodLimitsData,
  useTokenByTopUpType,
  useAllowedRecipients,
} from 'modules/motions/hooks'
import { useTransitionLimits } from 'modules/motions/hooks/useTransitionLimits'
import {
  MotionLimitProgress,
  MotionLimitProgressWrapper,
} from 'modules/motions/ui/MotionLimitProgress'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
} from '../CreateMotionFormStyle'

import {
  ContractEvmLegoLDOTopUp,
  ContractEvmGasFunderETHTopUp,
  ContractStonksStethTopUp,
  ContractEcosystemOpsStethTopUp,
  ContractLabsOpsStethTopUp,
} from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { validateToken } from 'modules/tokens/utils/validateToken'
import {
  estimateGasFallback,
  checkInputsGreaterThanLimit,
} from 'modules/motions/utils'
import { periodLimitError } from 'modules/motions/constants'
import { validateTransitionLimit } from 'modules/motions/utils/validateTransitionLimit'

export const TOP_UP_WITH_LIMITS_MAP = {
  [MotionType.LegoLDOTopUp]: {
    evmContract: ContractEvmLegoLDOTopUp,
    motionType: MotionType.LegoLDOTopUp,
  },
  [MotionType.GasFunderETHTopUp]: {
    evmContract: ContractEvmGasFunderETHTopUp,
    motionType: MotionType.GasFunderETHTopUp,
  },
  [MotionType.StonksStethTopUp]: {
    evmContract: ContractStonksStethTopUp,
    motionType: MotionType.StonksStethTopUp,
  },
  [MotionType.EcosystemOpsStethTopUp]: {
    evmContract: ContractEcosystemOpsStethTopUp,
    motionType: MotionType.EcosystemOpsStethTopUp,
  },
  [MotionType.LabsOpsStethTopUp]: {
    evmContract: ContractLabsOpsStethTopUp,
    motionType: MotionType.LabsOpsStethTopUp,
  },
}

type Program = {
  address: string
  amount: string
}

export const formParts = ({
  registryType,
}: {
  registryType: keyof typeof TOP_UP_WITH_LIMITS_MAP
}) =>
  createMotionFormPart({
    motionType: TOP_UP_WITH_LIMITS_MAP[registryType].motionType,
    populateTx: async ({ evmScriptFactory, formData, contract }) => {
      const encodedCallData = new utils.AbiCoder().encode(
        ['address[]', 'uint256[]'],
        [
          formData.programs.map(p => utils.getAddress(p.address)),
          formData.programs.map(p => utils.parseEther(p.amount)),
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
      programs: [{ address: '', amount: '' }] as Program[],
    }),
    Component: function StartNewMotionMotionFormLego({
      fieldNames,
      submitAction,
    }) {
      const { walletAddress } = useWeb3()
      const trustedCaller = TOP_UP_WITH_LIMITS_MAP[
        registryType
      ].evmContract.useSwrWeb3('trustedCaller', [])
      const isTrustedCallerConnected = trustedCaller.data === walletAddress

      const { data: periodLimitsData, initialLoading: periodLimitsLoading } =
        usePeriodLimitsData({ registryType })

      const legoDAIRecipients = useAllowedRecipients({ registryType })
      const token = useTokenByTopUpType({ registryType })

      const fieldsArr = useFieldArray({ name: fieldNames.programs })

      const handleAddProgram = useCallback(
        () => fieldsArr.append({ address: '', amount: '' }),
        [fieldsArr],
      )

      const handleRemoveProgram = useCallback(
        (i: number) => fieldsArr.remove(i),
        [fieldsArr],
      )

      const { watch, setValue } = useFormContext()
      const selectedPrograms: Program[] = watch(fieldNames.programs)

      const newAmount = selectedPrograms.reduce(
        (acc, program) => acc + Number(program.amount),
        0,
      )

      const getFilteredOptions = (fieldIdx: number) => {
        if (!legoDAIRecipients.data) return []
        const thatAddress = selectedPrograms[fieldIdx]?.address
        const selectedAddresses = selectedPrograms.map(({ address }) => address)
        return legoDAIRecipients.data.filter(
          ({ address }) =>
            !selectedAddresses.includes(address) || address === thatAddress,
        )
      }

      useEffect(() => {
        const recipientsCount = legoDAIRecipients.data?.length || 0
        const isMoreThanOne = recipientsCount > 1

        if (isMoreThanOne) return

        const recipientAddress = legoDAIRecipients.data?.[0].address || ''
        setValue(fieldNames.programs, [
          { address: recipientAddress, amount: '' },
        ])
      }, [fieldNames.programs, setValue, legoDAIRecipients.data])

      const { data: limits, initialLoading: isTransitionLimitsDataLoading } =
        useTransitionLimits()
      const transitionLimit =
        token.address && limits?.[utils.getAddress(token.address)]

      if (
        trustedCaller.initialLoading ||
        legoDAIRecipients.initialLoading ||
        isTransitionLimitsDataLoading ||
        periodLimitsLoading
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
          {periodLimitsData?.periodData && (
            <MotionLimitProgressWrapper>
              <MotionLimitProgress
                spentAmount={periodLimitsData.periodData.alreadySpentAmount}
                totalLimit={periodLimitsData.limits.limit}
                startDate={periodLimitsData.periodData.periodStartTimestamp}
                endDate={periodLimitsData.periodData.periodEndTimestamp}
                token={token.label}
                newAmount={newAmount}
              />
            </MotionLimitProgressWrapper>
          )}

          {fieldsArr.fields.map((item, i) => (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  <FieldsHeaderDesc>Recipient #{i + 1}</FieldsHeaderDesc>
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton onClick={() => handleRemoveProgram(i)}>
                      Remove recipient {i + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>
                {periodLimitsData?.isEndInNextPeriod && (
                  <MotionInfoBox>
                    The motion is ending in the next period. The transfer limit
                    would be replenished by that time.
                  </MotionInfoBox>
                )}
                <Fieldset>
                  <SelectControl
                    label="Top up recipient address"
                    name={`${fieldNames.programs}.${i}.address`}
                    rules={{ required: 'Field is required' }}
                  >
                    {getFilteredOptions(i).map((program, j) => (
                      <Option
                        key={j}
                        value={program.address}
                        children={program.title}
                      />
                    ))}
                  </SelectControl>
                </Fieldset>

                <Fieldset>
                  <InputNumberControl
                    label={`${token.label} Amount`}
                    name={`${fieldNames.programs}.${i}.amount`}
                    autoFocus
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const tokenError = validateToken(value)
                        if (tokenError) {
                          return tokenError
                        }

                        const transitionLimitError = validateTransitionLimit(
                          value,
                          transitionLimit,
                          token.label,
                        )
                        if (transitionLimitError) {
                          return transitionLimitError
                        }

                        const isLargeThenPeriodLimit =
                          checkInputsGreaterThanLimit({
                            inputValues: selectedPrograms,
                            spendableBalanceInPeriod: Number(
                              periodLimitsData?.periodData
                                .spendableBalanceInPeriod,
                            ),
                            currentValue: { value, index: i },
                          })

                        if (
                          periodLimitsData?.periodData
                            .spendableBalanceInPeriod &&
                          isLargeThenPeriodLimit
                        ) {
                          return periodLimitError()
                        }
                        return true
                      },
                    }}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          ))}

          {legoDAIRecipients.data &&
            fieldsArr.fields.length < legoDAIRecipients.data.length && (
              <Fieldset>
                <ButtonIcon
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddProgram}
                  icon={<Plus />}
                  color="secondary"
                >
                  One more recipient
                </ButtonIcon>
              </Fieldset>
            )}

          {submitAction}
        </>
      )
    },
  })
