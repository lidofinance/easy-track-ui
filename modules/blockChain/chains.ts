import { CHAINS } from '@lido-sdk/constants'

export const ChainNames = {
  [CHAINS.Mainnet]: 'Mainnet',
  [CHAINS.Ropsten]: 'Ropsten',
  [CHAINS.Rinkeby]: 'Rinkeby',
  [CHAINS.Goerli]: 'Goerli',
  [CHAINS.Kovan]: 'Kovan',
  [CHAINS.Kintsugi]: 'Kintsugi',
  [CHAINS.Holesky]: 'Holesky',
} as const

export const parseChainId = (chainId: number | string) => {
  return Number(chainId) as keyof typeof ChainNames
}

export const getChainName = (chainId: number) =>
  ChainNames[parseChainId(chainId)]
