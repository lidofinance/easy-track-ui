import { useForm } from 'react-hook-form'
import { Form } from 'modules/shared/ui/Controls/Form'
import { Option, SelectControl } from 'modules/shared/ui/Controls/Select'
import { useStonksData } from 'modules/stonks/hooks/useStonksData'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import {
  FormFields,
  InfoRow,
  InfoValue,
  MessageBox,
  RetryHint,
} from './StonksOrderFormStyle'
import { Button } from '@lidofinance/lido-ui'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { FormattedDuration } from 'modules/shared/ui/Utils/FormattedDuration'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { formatValue } from 'modules/stonks/utils/formatValue'
import { StonksOrderProgress } from '../StonksOrderProgress/StonksOrderProgress'
import { useStonksOrderSubmit } from './useStonksOrderSubmit'
import { FormData } from './types'

type Props = {
  addressParam: string | null
}

export function StonksOrderForm({ addressParam }: Props) {
  const { data: stonksList, initialLoading: isStonksDataLoading } =
    useStonksData()

  const formMethods = useForm<FormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      stonksAddress: addressParam ?? '',
    },
  })
  const selectedStonksAddress = formMethods.watch('stonksAddress')
  const selectedStonksPair = stonksList?.find(
    stonks => stonks.address === selectedStonksAddress,
  )

  const { isSubmitting, resultTx, handleTxReset, handleSubmit } =
    useStonksOrderSubmit()

  if (resultTx) {
    return <StonksOrderProgress resultTx={resultTx} onRetry={handleTxReset} />
  }

  if (isStonksDataLoading) {
    return <PageLoader />
  }

  if (!stonksList?.length) {
    return <MessageBox>No pending orders found</MessageBox>
  }

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      <FormFields>
        <SelectControl name="stonksAddress" label="Stonks Pair">
          {stonksList.map(stonks => (
            <Option
              key={stonks.address}
              value={stonks.address}
              children={`${stonks.tokenFrom.label} → ${stonks.tokenTo.label}`}
            />
          ))}
        </SelectControl>
        {selectedStonksPair && (
          <>
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
                <InfoValue>
                  {formatValue(selectedStonksPair.expectedOutput)}{' '}
                  {selectedStonksPair.tokenTo.label}
                </InfoValue>
              </InfoRow>
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
          </>
        )}
      </FormFields>
      {selectedStonksPair && (
        <>
          <Button
            type="submit"
            fullwidth
            children="Create Order"
            loading={isSubmitting}
          />
          {isSubmitting && (
            <RetryHint>
              If something went wrong press{' '}
              <button type="submit" children="Retry" />
            </RetryHint>
          )}
        </>
      )}
    </Form>
  )
}
