import { CHAINS } from '@lido-sdk/constants'
import { utils } from 'ethers'

type OffChainOrderInput = {
  address: string
  sellToken: string
  buyToken: string
  receiver: string
  sellAmount: string
  buyAmount: string
  validTo: number
}

type OffChainOrderPayload = {
  from: string
  feeAmount: '0' // as in Order.sol
  kind: 'sell' // as in Order.sol
  partiallyFillable: false // as in Order.sol
  sellTokenBalance: 'erc20' // as in Order.sol
  buyTokenBalance: 'erc20' // as in Order.sol
  appData: string // keccak256("LIDO_DOES_STONKS")
  signingScheme: 'eip1271'
  signature: '0x'
} & OffChainOrderInput

export const createOffChainOrder = async (
  order: OffChainOrderInput,
  chainId: CHAINS,
) => {
  const payload: OffChainOrderPayload = {
    ...order,
    appData: utils.keccak256(utils.toUtf8Bytes('LIDO_DOES_STONKS')),
    feeAmount: '0',
    partiallyFillable: false,
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
