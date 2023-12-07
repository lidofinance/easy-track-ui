import { ResultTx } from 'modules/blockChain/types'
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
import { Button, ToastError } from '@lidofinance/lido-ui'
import { useState } from 'react'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { FormattedDuration } from 'modules/shared/ui/Utils/FormattedDuration'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { estimateGasFallback } from 'modules/motions/utils'
import { useTransactionSender } from 'modules/blockChain/hooks/useTransactionSender'
import { getErrorMessage } from 'modules/shared/utils/getErrorMessage'
import { formatValue } from 'modules/stonks/utils/formatValue'
import { StonksAbi__factory } from 'generated'

type FormData = {
  stonksAddress: string
}

type Props = {
  onComplete: (tx: ResultTx) => void
}

export function StonksOrderForm({ onComplete }: Props) {
  const { library } = useWeb3()
  const [isSubmitting, setSubmitting] = useState(false)
  const { data: stonksList, initialLoading: isStonksDataLoading } =
    useStonksData()

  const formMethods = useForm<FormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      stonksAddress: '',
    },
  })
  const selectedStonksAddress = formMethods.watch('stonksAddress')
  const selectedStonksPair = stonksList?.find(
    stonks => stonks.address === selectedStonksAddress,
  )

  const populateOrder = async () => {
    if (!selectedStonksPair) {
      throw new Error('Pair is not selected')
    }
    if (!library) {
      throw new Error('Library not found')
    }

    const stonksContract = StonksAbi__factory.connect(
      selectedStonksPair.address,
      library,
    )
    const gasLimit = await estimateGasFallback(
      stonksContract.estimateGas.placeOrder(),
    )
    const tx = await stonksContract.populateTransaction.placeOrder({
      gasLimit,
    })
    return tx
  }

  const txOrder = useTransactionSender(populateOrder, {
    onFinish: onComplete,
  })

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      await txOrder.send()
    } catch (error: any) {
      console.error(error)
      ToastError(getErrorMessage(error), {})
    } finally {
      setSubmitting(false)
    }
  }

  if (isStonksDataLoading) {
    return <PageLoader />
  }

  if (!stonksList?.length) {
    return <MessageBox>No active stonks found</MessageBox>
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
            children="Place Order"
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
