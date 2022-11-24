import { utils } from 'ethers'

import { Fragment, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, ButtonIcon } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  useAllowedRecipientActual,
  useAllowedRecipientPeriodLimitsData,
} from 'modules/motions/hooks/useAllowedRecipient'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'
import {
  MotionLimitProgress,
  MotionLimitProgressWrapper,
} from 'modules/motions/ui/MotionLimitProgress'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { MotionWarningBox } from 'modules/shared/ui/Common/MotionWarningBox'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
} from '../CreateMotionFormStyle'

import {
  ContractGovernanceToken,
  ContractEvmAllowedRecipientTopUp,
} from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { validateToken } from 'modules/tokens/utils/validateToken'
import {
  estimateGasFallback,
  checkInputsLargeThenLimit,
} from 'modules/motions/utils'
import {
  TRANSITION_LIMITS,
  tokenLimitError,
  periodLimitError,
} from 'modules/motions/constants'

type Program = {
  address: string
  amount: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.AllowedRecipientTopUp,
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
    const { chainId, walletAddress } = useWeb3()
    const trustedCaller = ContractEvmAllowedRecipientTopUp.useSwrWeb3(
      'trustedCaller',
      [],
    )
    const isTrustedCallerConnected = trustedCaller.data === walletAddress

    const { data: periodLimitsData, initialLoading: periodLimitsLoading } =
      useAllowedRecipientPeriodLimitsData()
    const allowedRecipients = useAllowedRecipientActual()
    const { data: governanceSymbol } = useGovernanceSymbol()

    const fieldsArr = useFieldArray({ name: fieldNames.programs })

    const handleAddProgram = useCallback(
      () => fieldsArr.append({ address: '', amount: '' }),
      [fieldsArr],
    )

    const handleRemoveProgram = useCallback(
      (i: number) => fieldsArr.remove(i),
      [fieldsArr],
    )

    const { watch } = useFormContext()
    const selectedPrograms: Program[] = watch(fieldNames.programs)

    const newAmount = selectedPrograms.reduce(
      (acc, program) => acc + Number(program.amount),
      0,
    )

    const getFilteredOptions = (fieldIdx: number) => {
      if (!allowedRecipients.data) return []
      const thatAddress = selectedPrograms[fieldIdx].address
      const selectedAddresses = selectedPrograms.map(({ address }) => address)
      return allowedRecipients.data.filter(
        ({ address }) =>
          !selectedAddresses.includes(address) || address === thatAddress,
      )
    }

    const tokenAddress = ContractGovernanceToken.address[chainId] as string
    const transitionLimit = TRANSITION_LIMITS[chainId][tokenAddress]

    if (
      trustedCaller.initialLoading ||
      allowedRecipients.initialLoading ||
      periodLimitsLoading
    ) {
      return <PageLoader />
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
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
              token={governanceSymbol}
              newAmount={newAmount}
            />
          </MotionLimitProgressWrapper>
        )}

        {fieldsArr.fields.map((item, i) => (
          <Fragment key={item.id}>
            <FieldsWrapper>
              <FieldsHeader>
                <FieldsHeaderDesc>Program #{i + 1}</FieldsHeaderDesc>
                {fieldsArr.fields.length > 1 && (
                  <RemoveItemButton onClick={() => handleRemoveProgram(i)}>
                    Remove program {i + 1}
                  </RemoveItemButton>
                )}
              </FieldsHeader>
              {periodLimitsData?.isEndInNextPeriod && (
                <MotionWarningBox>
                  Please note that this program will be finished in the next
                  month. Motion bank limit for the next month may differ from
                  this. This program will not be accepted if motion bank limit
                  is reached.
                </MotionWarningBox>
              )}
              <Fieldset>
                <SelectControl
                  label="Reward program address"
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
                <InputControl
                  label={`${governanceSymbol} Amount`}
                  name={`${fieldNames.programs}.${i}.amount`}
                  rules={{
                    required: 'Field is required',
                    validate: value => {
                      const check1 = validateToken(value)
                      if (typeof check1 === 'string') {
                        return check1
                      }
                      if (Number(value) > transitionLimit) {
                        return tokenLimitError(
                          governanceSymbol,
                          transitionLimit,
                        )
                      }

                      const isLargeThenPeriodLimit = checkInputsLargeThenLimit({
                        inputValues: selectedPrograms,
                        spendableBalanceInPeriod: Number(
                          periodLimitsData?.periodData.spendableBalanceInPeriod,
                        ),
                        currentValue: { value, index: i },
                      })

                      if (
                        periodLimitsData?.periodData.spendableBalanceInPeriod &&
                        isLargeThenPeriodLimit
                      ) {
                        return periodLimitError(
                          governanceSymbol,
                          Number(
                            periodLimitsData.periodData
                              .spendableBalanceInPeriod,
                          ),
                        )
                      }
                      return true
                    },
                  }}
                />
              </Fieldset>
            </FieldsWrapper>
          </Fragment>
        ))}

        {allowedRecipients.data &&
          fieldsArr.fields.length < allowedRecipients.data.length && (
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
