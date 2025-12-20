import { useForm } from 'react-hook-form'
import { Form } from 'modules/shared/ui/Controls/Form'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import {
  FormFields,
  InfoRow,
  InfoValue,
  RetryHint,
  InputRow,
} from './StonksOrderFormStyle'
import { Button } from '@lidofinance/lido-ui'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { FormattedDuration } from 'modules/shared/ui/Utils/FormattedDuration'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { formatValueBn } from 'modules/stonks/utils/formatValue'
import { StonksOrderProgress } from '../StonksOrderProgress/StonksOrderProgress'
import { useStonksOrderSubmit } from './useStonksOrderSubmit'
import { FormData } from './types'
import { Title } from 'modules/shared/ui/Common/Title'
import { StonksData } from 'modules/stonks/types'
import { formatBp } from 'modules/vaults/utils/formatVaultParam'
import { validateTokenValue } from 'modules/motions/utils/validateEtherValue'
import { parseUnits } from 'ethers/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { StonksAbi__factory } from 'generated'
import { validateSellAmount } from 'modules/stonks/utils/validateSellAmount'

type Props = {
  stonksPairData: StonksData
}

export function StonksOrderForm({ stonksPairData }: Props) {
  const [isLoadingOutput, setIsLoadingOutput] = useState(false)
  const { library } = useWeb3()
  const formMethods = useForm<FormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      sellAmount: '',
      minBuyAmount: '',
    },
  })

  const stonksContract = useMemo(() => {
    if (!library) {
      throw new Error('Library not found')
    }

    return StonksAbi__factory.connect(stonksPairData.address, library)
  }, [library, stonksPairData.address])

  // Set sellAmount to full balance by default for v1 stonks pairs on initial render
  useEffect(() => {
    if (
      !formMethods.formState.isDirty &&
      stonksPairData.version === 'v1' &&
      !stonksPairData.currentBalance.isZero()
    ) {
      formMethods.setValue(
        'sellAmount',
        formatValueBn(
          stonksPairData.currentBalance,
          stonksPairData.tokenFrom.decimals,
        ),
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sellAmount = formMethods.watch('sellAmount')

  useEffect(() => {
    if (
      validateSellAmount(
        sellAmount,
        stonksPairData.tokenFrom.decimals,
        stonksPairData.currentBalance,
      ) !== true
    ) {
      return
    }

    setIsLoadingOutput(true)

    const timer = setTimeout(() => {
      const loadEstimatedOutput = async () => {
        try {
          const estimatedOutput = await stonksContract.estimateTradeOutput(
            parseUnits(sellAmount, stonksPairData.tokenFrom.decimals),
          )

          formMethods.setValue(
            'minBuyAmount',
            formatValueBn(estimatedOutput, stonksPairData.tokenTo.decimals),
            {
              shouldValidate: true,
              shouldDirty: true,
            },
          )
        } catch (error) {
          console.error('estimateTradeOutput fetch failed:', error)
        } finally {
          setIsLoadingOutput(false)
        }
      }

      loadEstimatedOutput()
    }, 800)

    // Cleanup: cancel timeout if user types again
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellAmount])

  const handleMaxButtonClick = () => {
    formMethods.setValue(
      'sellAmount',
      formatValueBn(
        stonksPairData.currentBalance,
        stonksPairData.tokenFrom.decimals,
      ),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    )
  }

  const { isSubmitting, resultTx, handleSubmit } =
    useStonksOrderSubmit(stonksPairData)

  if (resultTx) {
    return <StonksOrderProgress resultTx={resultTx} />
  }

  const isBalanceZero = stonksPairData.currentBalance.isZero()

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      <Title
        title={`Stonks pair ${stonksPairData.tokenFrom.label} -> ${stonksPairData.tokenTo.label}`}
      />
      <FormFields>
        <MotionInfoBox>
          <InfoRow>
            Current Stonks balance:
            <InfoValue>
              {formatValueBn(
                stonksPairData.currentBalance,
                stonksPairData.tokenFrom.decimals,
              )}{' '}
              {stonksPairData.tokenFrom.label}
            </InfoValue>
          </InfoRow>
          <InputRow>
            <InputNumberControl
              name="sellAmount"
              label="Amount to sell"
              rules={{
                required: 'Field is required',
                validate: value =>
                  validateSellAmount(
                    value,
                    stonksPairData.tokenFrom.decimals,
                    stonksPairData.currentBalance,
                  ),
              }}
              disabled={stonksPairData.version === 'v1'}
              rightDecorator={
                <Button
                  size="xxs"
                  variant="translucent"
                  onClick={handleMaxButtonClick}
                  disabled={isBalanceZero}
                  data-testid="maxBtn"
                >
                  MAX
                </Button>
              }
            />
          </InputRow>
          <InputRow>
            <InputNumberControl
              label="Minimum amount to buy"
              name="minBuyAmount"
              disabled={isLoadingOutput}
              rules={{
                required: 'Field is required',
                validate: value => {
                  const tokenError = validateTokenValue(
                    value,
                    stonksPairData.tokenTo.decimals,
                  )
                  if (tokenError) {
                    return tokenError
                  }

                  if (Number(value) <= 0) {
                    return 'Value must be greater than zero'
                  }

                  return true
                },
              }}
            />
          </InputRow>
        </MotionInfoBox>

        <MotionInfoBox>
          <InfoRow>
            From:
            <InfoValue>
              <AddressInlineWithPop
                address={stonksPairData.tokenFrom.address}
              />
              ({stonksPairData.tokenFrom.label})
            </InfoValue>
          </InfoRow>
          <InfoRow>
            To:
            <InfoValue>
              <AddressInlineWithPop address={stonksPairData.tokenTo.address} />(
              {stonksPairData.tokenTo.label})
            </InfoValue>
          </InfoRow>
          <InfoRow>
            Order duration:
            <InfoValue>
              <FormattedDuration
                value={stonksPairData.orderDurationInSeconds}
                unit="seconds"
              />
            </InfoValue>
          </InfoRow>
          <InfoRow>
            Margin:
            <InfoValue>{formatBp(stonksPairData.marginBP)}</InfoValue>
          </InfoRow>
          <InfoRow>
            Price tolerance:
            <InfoValue>{formatBp(stonksPairData.priceToleranceBP)}</InfoValue>
          </InfoRow>
        </MotionInfoBox>
      </FormFields>
      <Button
        type="submit"
        fullwidth
        disabled={
          (formMethods.formState.isDirty && !formMethods.formState.isValid) ||
          isBalanceZero
        }
        children="Create Order"
        loading={isSubmitting}
      />
      {isSubmitting && (
        <RetryHint>
          If something went wrong press{' '}
          <button type="submit" children="Retry" />
        </RetryHint>
      )}
    </Form>
  )
}
