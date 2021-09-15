import { PopulatedTransaction } from '@ethersproject/contracts'
import { toastInfo } from 'modules/toasts'
import { ResultTx } from '../types'
import { checkConnectedToSafe } from './checkConnectedToSafe'
import { getWalletNameFromContract } from './getWalletNameFromContract'

// This workaround exists because gnosis safe return making regular `sendTransaction` endlessly waiting
// https://github.com/ethers-io/ethers.js/blob/7274cd06cf3f6f31c6df3fd6636706d8536b7ee2/packages/providers/src.ts/json-rpc-provider.ts#L226-L246

export async function sendTransactionGnosisWorkaround(
  contract: any,
  transaction: PopulatedTransaction,
): Promise<ResultTx> {
  const { signer } = contract
  const walletName = getWalletNameFromContract(contract)
  const isGnosisSafe = checkConnectedToSafe(contract)

  toastInfo(`Confirm transaction with ${walletName}`)

  if (isGnosisSafe) {
    const hash: string = await (signer as any).sendUncheckedTransaction(
      transaction,
    )
    return {
      type: 'safe',
      tx: { safeTxHash: hash },
    }
  }

  const tx = await signer.sendTransaction(transaction)

  return {
    type: 'regular',
    tx,
  }
}
