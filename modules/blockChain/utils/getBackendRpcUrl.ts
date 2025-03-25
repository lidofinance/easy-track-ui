import { CHAINS } from '@lido-sdk/constants'
import { parseChainId } from '../chains'

export const getBackendRpcUrl = (chainId: CHAINS) => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin
  return `${BASE_URL}/api/rpc?chainId=${parseChainId(chainId)}`
}

export const backendRPC = {
  [CHAINS.Mainnet]: getBackendRpcUrl(CHAINS.Mainnet),
  [CHAINS.Goerli]: getBackendRpcUrl(CHAINS.Goerli),
  [CHAINS.Holesky]: getBackendRpcUrl(CHAINS.Holesky),
  [CHAINS.Hoodi]: getBackendRpcUrl(CHAINS.Hoodi),
}
