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
  const chain = get(PREFIXES, chainId, '?')
  return `https://app.safe.global/transactions/tx?safe=${chain}:${address}&id=multisig_${address}_${txHash}`
}
