import { utils } from 'ethers'

import { Fragment, useEffect, useMemo } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, ButtonIcon } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useRecipientActual, usePeriodLimitsData } from 'modules/motions/hooks'
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
  ContractEvmRccStablesTopUp,
  ContractEvmPmlStablesTopUp,
  ContractEvmAtcStablesTopUp,
} from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { validateToken } from 'modules/tokens/utils/validateToken'
import {
  estimateGasFallback,
  checkInputsGreaterThanLimit,
} from 'modules/motions/utils'
import { tokenLimitError, periodLimitError } from 'modules/motions/constants'
import { useAllowedTokens } from 'modules/motions/hooks/useAllowedTokensRegistry'
import { Text } from 'modules/shared/ui/Common/Text'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { DEFAULT_DECIMALS } from 'modules/blockChain/constants'

export const TOPUP_WITH_LIMITS_MAP = {
  [MotionType.RccStablesTopUp]: {
    evmContract: ContractEvmRccStablesTopUp,
    motionType: MotionType.RccStablesTopUp,
  },
  [MotionType.PmlStablesTopUp]: {
    evmContract: ContractEvmPmlStablesTopUp,
    motionType: MotionType.PmlStablesTopUp,
  },
  [MotionType.AtcStablesTopUp]: {
    evmContract: ContractEvmAtcStablesTopUp,
    motionType: MotionType.AtcStablesTopUp,
  },
}

type Program = {
  address: string
  amount: string
}

export const formParts = ({
  registryType,
}: {
  registryType: keyof typeof TOPUP_WITH_LIMITS_MAP
}) =>
  createMotionFormPart({
    motionType: TOPUP_WITH_LIMITS_MAP[registryType].motionType,
    populateTx: async ({ evmScriptFactory, formData, contract }) => {
      const encodedCallData = new utils.AbiCoder().encode(
        ['address', 'address[]', 'uint256[]'],
        [
          utils.getAddress(formData.tokenAddress),
          formData.programs.map(p => utils.getAddress(p.address)),
          formData.programs.map(p =>
            utils.parseUnits(p.amount, formData.tokenDecimals),
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
      tokenAddress: '',
      tokenDecimals: DEFAULT_DECIMALS,
      programs: [{ address: '', amount: '' }] as Program[],
    }),
    Component: function StartNewMotionMotionFormLego({
      fieldNames,
      submitAction,
    }) {
      const { walletAddress } = useWeb3()
      const trustedCaller = TOPUP_WITH_LIMITS_MAP[
        registryType
      ].evmContract.useSwrWeb3('trustedCaller', [])
      const isTrustedCallerConnected = trustedCaller.data === walletAddress

      const {
        allowedTokens,
        tokensDecimalsMap,
        initialLoading: isTokensDataLoading,
      } = useAllowedTokens()
      const {
        data: periodLimitsData,
        initialLoading: isPeriodLimitsDataLoading,
      } = usePeriodLimitsData({ registryType })

      const {
        data: actualRecipients,
        initialLoading: isRecipientsDataLoading,
      } = useRecipientActual({ registryType })

      const fieldsArr = useFieldArray({ name: fieldNames.programs })

      const handleAddProgram = () =>
        fieldsArr.append({ address: '', amount: '' })

      const { watch, setValue } = useFormContext()
      const selectedPrograms: Program[] = watch(fieldNames.programs)
      const selectedTokenAddress = watch(fieldNames.tokenAddress)

      const selectedTokenLabel = useMemo(() => {
        if (!selectedTokenAddress || !allowedTokens?.length) {
          return ''
        }
        return allowedTokens.find(
          ({ address }) => address === selectedTokenAddress,
        )?.label
      }, [allowedTokens, selectedTokenAddress])

      const newAmount = selectedPrograms.reduce(
        (acc, program) => acc + Number(program.amount),
        0,
      )

      const getFilteredOptions = (fieldIdx: number) => {
        if (!actualRecipients) return []
        const thatAddress = selectedPrograms[fieldIdx]?.address
        const selectedAddresses = selectedPrograms.map(({ address }) => address)
        return actualRecipients.filter(
          ({ address }) =>
            !selectedAddresses.includes(address) || address === thatAddress,
        )
      }

      useEffect(() => {
        const recipientsCount = actualRecipients?.length || 0
        const isMoreThanOne = recipientsCount > 1

        if (isMoreThanOne) return

        const recipientAddress = actualRecipients?.[0].address || ''
        setValue(fieldNames.programs, [
          { address: recipientAddress, amount: '' },
        ])
      }, [fieldNames.programs, setValue, actualRecipients])

      const { data: limits } = useTransitionLimits()
      const transitionLimit =
        selectedTokenAddress && limits?.[utils.getAddress(selectedTokenAddress)]

      if (
        trustedCaller.initialLoading ||
        isRecipientsDataLoading ||
        isPeriodLimitsDataLoading ||
        isTokensDataLoading
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
          <Fieldset>
            <SelectControl
              label="Top up token"
              name={fieldNames.tokenAddress}
              rules={{ required: 'Field is required' }}
              onChange={(value: string) => {
                const tokenDecimals = tokensDecimalsMap?.[value]
                if (tokenDecimals) {
                  setValue(fieldNames.tokenDecimals, tokenDecimals)
                }
              }}
            >
              {allowedTokens?.map((token, j) => (
                <Option key={j} value={token.address} children={token.label} />
              ))}
            </SelectControl>
          </Fieldset>
          {selectedTokenAddress && (
            <MotionInfoBox>
              <Text as="span" size={12} weight={500}>
                {selectedTokenLabel || 'Token'} address:{' '}
              </Text>
              <AddressInlineWithPop
                address={selectedTokenAddress}
                trim={false}
              />
            </MotionInfoBox>
          )}
          {periodLimitsData?.periodData && selectedTokenAddress && (
            <MotionLimitProgressWrapper>
              <MotionLimitProgress
                spentAmount={periodLimitsData.periodData.alreadySpentAmount}
                totalLimit={periodLimitsData.limits.limit}
                startDate={periodLimitsData.periodData.periodStartTimestamp}
                endDate={periodLimitsData.periodData.periodEndTimestamp}
                token={selectedTokenLabel}
                newAmount={newAmount}
              />
            </MotionLimitProgressWrapper>
          )}

          {fieldsArr.fields.map((item, fieldIdx) => (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  <FieldsHeaderDesc>Recipient #{fieldIdx + 1}</FieldsHeaderDesc>
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => fieldsArr.remove(fieldIdx)}
                    >
                      Remove recipient {fieldIdx + 1}
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
                    name={`${fieldNames.programs}.${fieldIdx}.address`}
                    rules={{ required: 'Field is required' }}
                  >
                    {getFilteredOptions(fieldIdx).map((program, j) => (
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
                    label={`${selectedTokenLabel} Amount`}
                    name={`${fieldNames.programs}.${fieldIdx}.amount`}
                    disabled={!selectedTokenAddress}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const tokenError = validateToken(value)
                        if (tokenError) {
                          return tokenError
                        }
                        if (
                          transitionLimit &&
                          Number(value) > transitionLimit
                        ) {
                          return tokenLimitError(
                            selectedTokenLabel,
                            transitionLimit,
                          )
                        }

                        const isLargeThenPeriodLimit =
                          checkInputsGreaterThanLimit({
                            inputValues: selectedPrograms,
                            spendableBalanceInPeriod: Number(
                              periodLimitsData?.periodData
                                .spendableBalanceInPeriod,
                            ),
                            currentValue: { value, index: fieldIdx },
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

          {actualRecipients &&
            fieldsArr.fields.length < actualRecipients.length && (
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
