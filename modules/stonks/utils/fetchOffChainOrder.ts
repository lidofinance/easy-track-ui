import { CHAINS } from '@lido-sdk/constants'
import { fetcherStandard } from 'modules/network/utils/fetcherStandard'
import { OffChainOrder } from '../types'

export const fetchOffChainOrder = async (
  orderAddress: string,
  chainId: CHAINS,
) => {
  try {
    const ordersByOwner = await fetcherStandard<OffChainOrder[] | undefined>(
      `/api/stonks/orders/${orderAddress}?chainId=${chainId}`,
    )

    if (!ordersByOwner?.length) {
      return null
    }

    return ordersByOwner[0]
  } catch (error) {
    return null
  }
}
