import { CHAINS } from '@lido-sdk/constants'

const PREFIXES = {
  [CHAINS.Mainnet]: 'eth',
  [CHAINS.Ropsten]: '?',
  [CHAINS.Rinkeby]: 'rin',
  [CHAINS.Goerli]: '?',
  [CHAINS.Kovan]: '?',
  [CHAINS.Kintsugi]: '?',
} as const

export const getGnosisSafeLink = (chainId: CHAINS, address: string) =>
  `https://gnosis-safe.io/app/${PREFIXES[chainId]}:${address}`
