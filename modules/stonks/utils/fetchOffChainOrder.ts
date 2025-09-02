import { CHAINS } from '@lido-sdk/constants'
import { fetcherStandard } from 'modules/network/utils/fetcherStandard'
import { OffChainOrder, OrderTransaction } from '../types'

const COWSWAP_API_ENDPOINTS: Partial<Record<CHAINS, string | undefined>> = {
  [CHAINS.Mainnet]: 'https://api.cow.fi/mainnet/api/v1',
}

const fetchOrderTransactions = async (orderUid: string, chainId: CHAINS) => {
  try {
    const cowApiEndpoint = COWSWAP_API_ENDPOINTS[chainId]

    if (!cowApiEndpoint) {
      throw new Error(`NO_CHAIN_${chainId}`)
    }

    const orderTransactions = await fetcherStandard<
      OrderTransaction[] | undefined
    >(`${cowApiEndpoint}/trades?orderUid=${orderUid}`)

    if (!orderTransactions?.length) {
      return []
    }

    return orderTransactions
  } catch (error) {
    return []
  }
}

export const fetchOffChainOrder = async (
  orderAddress: string,
  chainId: CHAINS,
): Promise<OffChainOrder | null> => {
  try {
    const cowApiEndpoint = COWSWAP_API_ENDPOINTS[chainId]

    if (!cowApiEndpoint) {
      throw new Error(`NO_CHAIN_${chainId}`)
    }

    const ordersByOwner = await fetcherStandard<OffChainOrder[] | undefined>(
      `${cowApiEndpoint}/account/${orderAddress}/orders`,
    )

    if (!ordersByOwner?.length) {
      return null
    }

    const order = ordersByOwner[0]

    const transactions = await fetchOrderTransactions(order.uid, chainId)

    return { ...order, transactions }
  } catch (error) {
    return null
  }
}
