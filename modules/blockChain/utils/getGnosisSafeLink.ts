import { Chains } from '../chains'

const SUBDOMAINS = {
  [Chains.Mainnet]: '',
  [Chains.Ropsten]: 'ropsten.',
  [Chains.Rinkeby]: 'rinkeby.',
  [Chains.Goerli]: 'goerli.',
  [Chains.Kovan]: 'kovan.',
} as const

export const getGnosisSafeLink = (chainId: Chains, address: string) =>
  `https://${SUBDOMAINS[chainId]}gnosis-safe.io/app/#/safes/${address}`
