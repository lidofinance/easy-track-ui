import get from 'lodash/get'
import { CHAINS } from '@lido-sdk/constants'

const PREFIXES = {
  [CHAINS.Mainnet]: 'eth',
  [CHAINS.Goerli]: 'gor',
  [CHAINS.Holesky]: 'eth',
} as const

export const getGnosisSafeLink = (
  chainId: CHAINS,
  address: string,
  txHash: string,
) => {
  switch (chainId) {
    case CHAINS.Holesky:
      return `https://holesky-safe.protofire.io/transactions?safe=holesky:${address}`
    case CHAINS.Hoodi:
      return `https://app.safe.protofire.io/transactions?safe=hoodi:${address}`
    default:
      const chain = get(PREFIXES, chainId, '?')
      return `https://app.safe.global/transactions/tx?safe=${chain}:${address}&id=multisig_${address}_${txHash}`
  }
}
