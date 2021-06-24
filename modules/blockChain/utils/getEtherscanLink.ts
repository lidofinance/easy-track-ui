import { ChainId, Chains } from '../chains'

const ETHERSCAN_SUBDOMAINS_BY_NETWORK = {
  [Chains.Mainnet]: '',
  [Chains.Ropsten]: 'ropsten.',
  [Chains.Rinkeby]: 'rinkeby.',
  [Chains.Goerli]: 'goerli.',
  [Chains.Kovan]: 'kovan.',
} as const

export type EtherscanEntities = 'tx' | 'token' | 'address'

export const getEtherscanLink = (
  chainId: ChainId,
  hash: string,
  entity: EtherscanEntities = 'tx',
) =>
  `https://${ETHERSCAN_SUBDOMAINS_BY_NETWORK[chainId]}etherscan.io/${entity}/${hash}`
