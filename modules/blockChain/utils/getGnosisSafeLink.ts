import { CHAINS } from '@lido-sdk/constants'

export const getGnosisSafeLink = (
  chainId: CHAINS,
  address: string,
  txHash: string,
) => {
  if (chainId === CHAINS.Holesky) {
    return `https://holesky-safe.protofire.io/transactions?safe=holesky:${address}`
  }
  return `https://app.safe.global/transactions/tx?safe=eth:${address}&id=multisig_${address}_${txHash}`
}
