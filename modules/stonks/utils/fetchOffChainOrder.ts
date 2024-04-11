import { CHAINS } from '@lido-sdk/constants'
import { fetcherStandard } from 'modules/network/utils/fetcherStandard'
import { OffChainOrder } from '../types'

const COWSWAP_API_ENDPOINTS: Partial<Record<CHAINS, string | undefined>> = {
  [CHAINS.Mainnet]: 'https://api.cow.fi/mainnet/api/v1',
  [CHAINS.Goerli]: 'https://api.cow.fi/goerli/api/v1',
}

export const fetchOffChainOrder = async (
  orderAddress: string,
  chainId: CHAINS,
) => {
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

    return ordersByOwner[0]
  } catch (error) {
    return null
  }
}
