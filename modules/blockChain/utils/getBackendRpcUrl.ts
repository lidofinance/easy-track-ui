import { CHAINS } from '@lido-sdk/constants'
import { parseChainId } from '../chains'
import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()
const { basePath } = serverRuntimeConfig

export const getBackendRpcUrl = (chainId: CHAINS) =>
  `${basePath ?? ''}/api/rpc?chainId=${parseChainId(chainId)}`

export const backendRPC = {
  [CHAINS.Mainnet]: getBackendRpcUrl(CHAINS.Mainnet),
  [CHAINS.Goerli]: getBackendRpcUrl(CHAINS.Goerli),
  [CHAINS.Kovan]: getBackendRpcUrl(CHAINS.Kovan),
  [CHAINS.Rinkeby]: getBackendRpcUrl(CHAINS.Rinkeby),
  [CHAINS.Ropsten]: getBackendRpcUrl(CHAINS.Ropsten),
}
