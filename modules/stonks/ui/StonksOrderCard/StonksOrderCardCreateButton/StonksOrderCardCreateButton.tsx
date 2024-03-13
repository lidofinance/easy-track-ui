import { Button, ToastError } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ButtonWrap } from '../StonksOrderCardStyle'
import { OrderDetailed } from 'modules/stonks/types'
import { useState } from 'react'
import { createOffChainOrder } from 'modules/stonks/utils/createOffChainOrder'

type Props = {
  order: OrderDetailed
  isDisabled?: boolean
  onSuccess?: () => void
}

export function StonksOrderCardCreateButton({
  order,
  isDisabled,
  onSuccess,
}: Props) {
  const { chainId } = useWeb3()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createOrder = async () => {
    if (isSubmitting) return
    try {
      setIsSubmitting(true)

      const orderInput = {
        address: order.address,
        sellToken: order.sellToken,
        buyToken: order.buyToken,
        receiver: order.receiver,
        sellAmount: order.sellAmountWei,
        buyAmount: order.buyAmountWei,
        validTo: order.validTo,
      }

      await createOffChainOrder(orderInput, chainId)
      onSuccess?.()
    } catch (error: any) {
      console.error(error)
      ToastError(error?.message ?? 'Something went wrong', {})
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ButtonWrap>
      <Button
        onClick={createOrder}
        loading={isSubmitting}
        disabled={isDisabled}
        fullwidth
      >
        Create Off-Chain Order
      </Button>
    </ButtonWrap>
  )
}
