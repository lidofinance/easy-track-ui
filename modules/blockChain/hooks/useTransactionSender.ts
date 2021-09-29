import { useEffect, useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useCurrentChain } from './useCurrentChain'
import { useSendTransactionGnosisWorkaround } from './useSendTransactionGnosisWorkaround'

import { ResultTx, TxStatus } from '../types'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { openWindow } from 'modules/shared/utils/openWindow'
import { getGnosisSafeLink } from '../utils/getGnosisSafeLink'
import { getEtherscanLink } from '../utils/getEtherscanLink'
import { toastError } from 'modules/toasts'

type PopulateFn =
  | (() => PopulatedTransaction)
  | (() => Promise<PopulatedTransaction>)

type Options = {
  onFinish?: (resultTx: ResultTx, status: TxStatus) => void
}

export function useTransactionSender(
  populateTx: PopulateFn,
  { onFinish }: Options = {},
) {
  const { library } = useWeb3React()
  const currentChain = useCurrentChain()
  const { walletAddress } = useWalletInfo()
  const [resultTx, setResultTx] = useState<ResultTx | null>(null)
  const [status, setStatus] = useState<TxStatus>('empty')
  const sendTransactionGnosisWorkaround = useSendTransactionGnosisWorkaround()

  const finish = useCallback(
    (finishStatus: TxStatus, finishTx: ResultTx) => {
      setStatus(finishStatus)
      if (finishStatus === 'success') onFinish?.(finishTx, finishStatus)
    },
    [onFinish],
  )

  const send = useCallback(async () => {
    try {
      setResultTx(null)
      setStatus('pending')

      const populatedTx = await populateTx()
      const res = await sendTransactionGnosisWorkaround(populatedTx)

      setResultTx(res)
      if (res.type === 'safe') finish('success', res)
    } catch (error: any) {
      setStatus('empty')
      console.error(error)
      toastError(error.message || (error as any).toString())
    }
  }, [finish, populateTx, sendTransactionGnosisWorkaround])

  useEffect(() => {
    if (!library || !resultTx || resultTx.type === 'safe') {
      return
    }

    const { tx } = resultTx

    const checkTransaction = (e: any) => {
      if (!e) {
        setStatus('pending')
      } else if (e.status === 1) {
        finish('success', resultTx)
      } else if (e.status === 0) {
        finish('failed', resultTx)
      }
    }

    library.getTransactionReceipt(tx.hash).then(checkTransaction)
    library.on(tx.hash, checkTransaction)

    return () => {
      library.off(tx.hash)
    }
  }, [library, resultTx, onFinish, finish])

  const open = useCallback(() => {
    if (!resultTx) return
    const link =
      resultTx.type === 'safe'
        ? getGnosisSafeLink(currentChain, `${walletAddress}/transaction`)
        : getEtherscanLink(currentChain, resultTx.tx.hash, 'tx')
    openWindow(link)
  }, [currentChain, resultTx, walletAddress])

  return {
    tx: resultTx,
    send,
    open,
    status,
    isEmpty: status === 'empty',
    isFailed: status === 'failed',
    isPending: status === 'pending',
    isSuccess: status === 'success',
  }
}

export type TransactionSender = ReturnType<typeof useTransactionSender>