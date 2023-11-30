import get from 'lodash/get'
import { CHAINS } from '@lido-sdk/constants'

const PREFIXES = {
  [CHAINS.Mainnet]: 'eth',
  [CHAINS.Goerli]: 'gor',
} as const

export const getGnosisSafeLink = (
  chainId: CHAINS,
  address: string,
  txHash: string,
) => {
  if (chainId === CHAINS.Holesky) {
    return `https://holesky-safe.protofire.io/transactions?safe=holesky:${address}`
  }
  const chain = get(PREFIXES, chainId, '?')
  return `https://app.safe.global/transactions/tx?safe=${chain}:${address}&id=multisig_${address}_${txHash}`
}
