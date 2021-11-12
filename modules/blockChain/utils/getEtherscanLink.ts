import { Chains } from '../chains'

const SUBDOMAINS = {
  [Chains.Mainnet]: '',
  [Chains.Ropsten]: 'ropsten.',
  [Chains.Rinkeby]: 'rinkeby.',
  [Chains.Goerli]: 'goerli.',
  [Chains.Kovan]: 'kovan.',
} as const

export type EtherscanEntities = 'tx' | 'token' | 'address'

export const getEtherscanLink = (
  chainId: Chains,
  hash: string,
  entity: EtherscanEntities = 'tx',
) => `https://${SUBDOMAINS[chainId]}etherscan.io/${entity}/${hash}`
