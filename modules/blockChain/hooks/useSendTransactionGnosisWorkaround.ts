import { useCallback } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { sendTransactionGnosisWorkaround } from '../utils/sendTransactionGnosisWorkaround'
import { useIsContract } from './useIsContract'

export function useSendTransactionGnosisWorkaround() {
  const { web3Provider } = useWeb3()
  // TODO: track loading state of this swr in the ui on yes/no/enact button
  const { data: isMultisig } = useIsContract()

  return useCallback(
    (tx: PopulatedTransaction) =>
      sendTransactionGnosisWorkaround(web3Provider, tx, !!isMultisig),
    [web3Provider, isMultisig],
  )
}
