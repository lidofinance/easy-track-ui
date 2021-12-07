import { CHAINS } from '@lido-sdk/constants'

export const ChainNames = {
  [CHAINS.Mainnet]: 'Mainnet',
  [CHAINS.Ropsten]: 'Ropsten',
  [CHAINS.Rinkeby]: 'Rinkeby',
  [CHAINS.Goerli]: 'Goerli',
  [CHAINS.Kovan]: 'Kovan',
} as const

export const parseChainId = (chainId: number | string) => {
  const parsed = Number(chainId)
  if (!ChainNames.hasOwnProperty(chainId)) {
    throw new Error(`Chain ${chainId} is not supported`)
  }
  return parsed as CHAINS
}

export const getChainName = (chainId: number) =>
  ChainNames[parseChainId(chainId)]
