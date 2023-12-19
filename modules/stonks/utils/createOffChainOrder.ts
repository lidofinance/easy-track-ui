import { CHAINS } from '@lido-sdk/constants'
import { Order } from '../types'

export const createOffChainOrder = async (order: Order, chainId: CHAINS) => {
  const payload = {
    ...order.orderData,
    from: order.address,
    kind: 'sell',
    signingScheme: 'eip1271',
    sellTokenBalance: 'erc20',
    buyTokenBalance: 'erc20',
    signature: '0x',
  }

  const response = await fetch(`/api/stonks/create-order?chainId=${chainId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  if (response.ok) {
    return data as string
  }

  throw new Error(data?.error ?? 'Something went wrong')
}
