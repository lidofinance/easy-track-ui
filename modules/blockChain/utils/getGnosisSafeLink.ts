import { Chains } from '../chains'

const PREFIXES = {
  [Chains.Mainnet]: 'eth',
  [Chains.Ropsten]: '?',
  [Chains.Rinkeby]: 'rin',
  [Chains.Goerli]: '?',
  [Chains.Kovan]: '?',
} as const

export const getGnosisSafeLink = (chainId: Chains, address: string) =>
  `https://gnosis-safe.io/app/${PREFIXES[chainId]}:${address}`
