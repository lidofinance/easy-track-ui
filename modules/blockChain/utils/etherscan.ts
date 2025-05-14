import invariant from 'tiny-invariant'
import { CHAINS } from '../chains'

/**
 *  Local copy of the same util form the "@lido-sdk/helpers"
 */

enum ETHERSCAN_ENTITIES {
  Tx = 'tx',
  Token = 'token',
  Address = 'address',
}

const ETHERSCAN_PREFIX_BY_NETWORK: Partial<Record<CHAINS, string>> = {
  [CHAINS.Mainnet]: '',
  [CHAINS.Holesky]: 'holesky.',
  [CHAINS.Hoodi]: 'hoodi.',
}

export const getEtherscanPrefix = (chainId: CHAINS) => {
  const prefix = ETHERSCAN_PREFIX_BY_NETWORK[chainId]
  invariant(prefix != null, 'Chain is not supported')
  return prefix
}

export const getEtherscanLink = (
  chainId: CHAINS,
  hash: string,
  entity: string,
) => {
  const prefix = getEtherscanPrefix(chainId)
  invariant(hash && typeof hash === 'string', 'Hash should be a string')
  invariant(entity && typeof entity === 'string', 'Entity should be a string')
  return `https://${prefix}etherscan.io/${entity}/${hash}`
}

export const getEtherscanTxLink = (chainId: CHAINS, hash: string) => {
  return getEtherscanLink(chainId, hash, ETHERSCAN_ENTITIES.Tx)
}

export const getEtherscanTokenLink = (chainId: CHAINS, hash: string) => {
  return getEtherscanLink(chainId, hash, ETHERSCAN_ENTITIES.Token)
}

export const getEtherscanAddressLink = (chainId: CHAINS, hash: string) => {
  return getEtherscanLink(chainId, hash, ETHERSCAN_ENTITIES.Address)
}
