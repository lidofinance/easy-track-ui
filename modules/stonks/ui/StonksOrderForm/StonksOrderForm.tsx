import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Form } from 'modules/shared/ui/Controls/Form'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { useStonksData } from 'modules/stonks/hooks/useStonksData'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import {
  FormFields,
  InfoRow,
  InfoValue,
  MessageBox,
  RetryHint,
  InputRow,
} from './StonksOrderFormStyle'
import { Button } from '@lidofinance/lido-ui'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { FormattedDuration } from 'modules/shared/ui/Utils/FormattedDuration'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { formatValue } from 'modules/stonks/utils/formatValue'
import { StonksOrderProgress } from '../StonksOrderProgress/StonksOrderProgress'
import { useStonksOrderSubmit } from './useStonksOrderSubmit'
import { FormData } from './types'
import { useRouter } from 'next/router'
import { Title } from 'modules/shared/ui/Common/Title'

export function StonksOrderForm() {
  const router = useRouter()
  const addressParam = String(router.query.stonksAddress)
  const { stonksData, isStonksDataLoading } = useStonksData()

  const formMethods = useForm<FormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      stonksAddress: addressParam,
      minAcceptableAmount: 0,
      tokenToDecimals: 0,
    },
  })

  const selectedStonksPair = stonksData?.find(
    stonks => stonks.address === addressParam,
  )

  useEffect(() => {
    if (selectedStonksPair) {
      formMethods.setValue(
        'minAcceptableAmount',
        selectedStonksPair.expectedOutput,
      )
      formMethods.setValue(
        'tokenToDecimals',
        selectedStonksPair.tokenToDecimals,
      )
    }
  }, [addressParam, selectedStonksPair, formMethods])

  const { isSubmitting, resultTx, handleSubmit } = useStonksOrderSubmit()

  if (resultTx) {
    return <StonksOrderProgress resultTx={resultTx} />
  }

  if (isStonksDataLoading) {
    return <PageLoader />
  }

  if (!selectedStonksPair) {
    return <MessageBox>Stonks pair not found</MessageBox>
  }

  const isBalanceZero = selectedStonksPair.currentBalanceBn.isZero()

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      <Title
        title={`Stonks pair ${selectedStonksPair.tokenFrom.label} -> ${selectedStonksPair.tokenTo.label}`}
      />
      <FormFields>
        <MotionInfoBox>
          <InfoRow>
            Current balance:
            <InfoValue>
              {formatValue(selectedStonksPair.currentBalance)}{' '}
              {selectedStonksPair.tokenFrom.label}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            Expected trade output:
            <InfoValue>{selectedStonksPair.tokenTo.label}</InfoValue>
          </InfoRow>
          <InputRow>
            <InputNumberControl
              label="Minimum acceptable amount"
              name="minAcceptableAmount"
              rules={{ required: 'Field is required' }}
              disabled={isBalanceZero}
            />
          </InputRow>
        </MotionInfoBox>

        <MotionInfoBox>
          <InfoRow>
            From:
            <InfoValue>
              <AddressInlineWithPop
                address={selectedStonksPair.tokenFrom.address}
              />
              ({selectedStonksPair.tokenFrom.label})
            </InfoValue>
          </InfoRow>
          <InfoRow>
            To:
            <InfoValue>
              <AddressInlineWithPop
                address={selectedStonksPair.tokenTo.address}
              />
              ({selectedStonksPair.tokenTo.label})
            </InfoValue>
          </InfoRow>
          <InfoRow>
            Order duration:
            <InfoValue>
              <FormattedDuration
                value={selectedStonksPair.orderDurationInSeconds}
                unit="seconds"
              />
            </InfoValue>
          </InfoRow>
          <InfoRow>
            Margin in basis points:
            <InfoValue>{selectedStonksPair.marginInBasisPoints}</InfoValue>
          </InfoRow>
          <InfoRow>
            Price tolerance in basis points:
            <InfoValue>
              {selectedStonksPair.priceToleranceInBasisPoints}
            </InfoValue>
          </InfoRow>
        </MotionInfoBox>
      </FormFields>
      <Button
        type="submit"
        fullwidth
        disabled={isBalanceZero}
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
