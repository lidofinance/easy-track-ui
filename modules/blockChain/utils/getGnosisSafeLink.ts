import { CHAINS } from '@lido-sdk/constants'

export const getGnosisSafeLink = (
  chainId: CHAINS,
  address: string,
  txHash?: string,
) => {
  if (chainId === CHAINS.Hoodi) {
    return `https://app.safe.protofire.io/transactions/queue?safe=hoodi:${address}`
  }
  if (txHash?.length) {
    return `https://app.safe.global/transactions/tx?safe=eth:${address}&id=multisig_${address}_${txHash}`
  }
  return `https://app.safe.global/transactions/queue?safe=eth:${address}`
}
