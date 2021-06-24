import { ChainId, getChainName, parseChainId } from '../chains'
import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()
const { basePath, infuraApiKey, alchemyApiKey } = serverRuntimeConfig

const getName = (chainId: ChainId) => getChainName(chainId).toLocaleLowerCase()

export const getInfuraRpcUrl = (chainId: ChainId) =>
  `https://${getName(chainId)}.infura.io/v3/${infuraApiKey}`

export const getAlchemyRpcUrl = (chainId: ChainId) =>
  `https://eth-${getName(chainId)}.alchemyapi.io/v2/${alchemyApiKey}`

export const getRpcJsonUrls = (chainId: ChainId): string[] => {
  const urls = []

  if (infuraApiKey) urls.push(getInfuraRpcUrl(chainId))
  if (alchemyApiKey) urls.push(getAlchemyRpcUrl(chainId))

  if (!urls.length) {
    throw new Error(
      'There are no API keys in env. Please, check your configuration',
    )
  }

  return urls
}

export const getRpcUrl = (chainId: ChainId) =>
  `${basePath ?? ''}/api/rpc?chainId=${parseChainId(chainId)}`
