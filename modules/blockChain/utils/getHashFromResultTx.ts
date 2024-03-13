import { CHAINS } from '@lido-sdk/constants'
import SafeApiKit from '@safe-global/api-kit'
import { ResultTx } from '../types'

async function getSafeTxDetails(safeTxHash: string, chainId: CHAINS) {
  const api = new SafeApiKit({
    chainId: BigInt(chainId),
  })

  const result = await api.getTransaction(safeTxHash)

  return result
}

export const getHashFromResultTx = async (
  resultTx: ResultTx,
  chainId: CHAINS,
) => {
  if (resultTx.type === 'regular') {
    return resultTx.tx.hash
  }

  const txDetails = await getSafeTxDetails(resultTx.tx.safeTxHash, chainId)
  if (!txDetails.transactionHash) {
    throw new Error('Transaction hash not found')
  }
  return txDetails.transactionHash
}
