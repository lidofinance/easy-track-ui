import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { sendTransactionGnosisWorkaround } from '../utils/sendTransactionGnosisWorkaround'

export function useSendTransactionGnosisWorkaround() {
  const { library } = useWeb3React()
  return useCallback(
    (tx: PopulatedTransaction) =>
      sendTransactionGnosisWorkaround(library.getSigner(), tx),
    [library],
  )
}
