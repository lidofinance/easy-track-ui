import { CHAINS, parseChainId } from 'modules/blockChain/chains'

export const SUBGRAPH_ENDPOINT = '/api/subgraph'

export const getRpcUrlDefault = (chainId: CHAINS) => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin
  return `${BASE_URL}/api/rpc?chainId=${parseChainId(chainId)}`
}
