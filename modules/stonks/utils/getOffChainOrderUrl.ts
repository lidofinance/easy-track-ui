import { CHAINS } from '@lido-sdk/constants'

export const getOffChainOrderUrl = (
  orderUid: string | undefined,
  chainId: CHAINS,
) => {
  if (!orderUid || chainId !== CHAINS.Mainnet) {
    return null
  }
  return `https://explorer.cow.fi/orders/${orderUid}`
}
