import { formatEther } from 'ethers/lib/utils'
import { useCallback } from 'react'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import {
  ContractEasyTrack,
  ContractGovernanceToken,
} from 'modules/blockChain/contracts'
import { useCheckWalletConnect } from 'modules/blockChain/hooks/useCheckWalletConnect'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'
import {
  useTransactionSender,
  TransactionSender,
} from 'modules/blockChain/hooks/useTransactionSender'

import { Button } from '@lidofinance/lido-ui'
import { Text } from 'modules/shared/ui/Common/Text'
import { Actions, Hint, TxHint, TxStatus } from './MotionDetailedActionsStyle'

import { Motion, MotionStatus } from 'modules/motions/types'
import { getEventMotionCreated } from 'modules/motions/utils/getEventMotionCreation'
import { getContractMethodParams } from 'modules/motions/utils/getContractMethodParams'
import { estimateGasFallback } from 'modules/motions/utils/estimateGasFallback'

function TxRow({ label, tx }: { label: string; tx: TransactionSender }) {
  return (
    <TxHint>
      {label}
      <TxStatus status={tx.status} onClick={tx.open}>
        {tx.isPending && 'Pending...'}
        {tx.isSuccess && 'Confirmed (click to open)'}
        {tx.isFailed && 'Failed (click to see why)'}
      </TxStatus>
    </TxHint>
  )
}

type Props = {
  motion: Motion
  onFinish?: () => void
}

function ActionsBody({ motion, onFinish }: Props) {
  const { walletAddress } = useWalletInfo()
  const contractEasyTrack = ContractEasyTrack.useWeb3()
  const { data: governanceSymbol } = useGovernanceSymbol()

  const balanceAt = ContractGovernanceToken.useSwrWeb3('balanceOfAt', [
    String(walletAddress),
    motion.snapshotBlock,
  ])
  const balanceAtFormatted = balanceAt.data && formatEther(balanceAt.data)

  const isObjected = ContractEasyTrack.useSwrWeb3('objections', [
    motion.id,
    String(walletAddress),
  ])

  const canObject = ContractEasyTrack.useSwrWeb3('canObjectToMotion', [
    motion.id,
    String(walletAddress),
  ])

  // Submit Objection
  const populateObject = useCallback(async () => {
    const gasLimit = await estimateGasFallback(
      contractEasyTrack.estimateGas.objectToMotion(motion.id),
    )
    const tx = await contractEasyTrack.populateTransaction.objectToMotion(
      motion.id,
      { gasLimit },
    )
    return tx
  }, [contractEasyTrack, motion.id])

  const txObject = useTransactionSender(populateObject, { onFinish })

  // Enact Motion
  const populateEnact = useCallback(async () => {
    const { _evmScriptCallData: callData } = await getEventMotionCreated(
      contractEasyTrack,
      motion.id,
    )
    const gasLimit = await estimateGasFallback(
      contractEasyTrack.estimateGas.enactMotion(motion.id, callData, {
        ...getContractMethodParams(motion.evmScriptFactory, 'enact'),
      }),
    )
    const tx = await contractEasyTrack.populateTransaction.enactMotion(
      motion.id,
      callData,
      {
        gasLimit,
        ...getContractMethodParams(motion.evmScriptFactory, 'enact'),
      },
    )
    return tx
  }, [contractEasyTrack, motion.evmScriptFactory, motion.id])

  const txEnact = useTransactionSender(populateEnact, { onFinish })

  // Loader
  const isLoadingActions =
    canObject.initialLoading ||
    isObjected.initialLoading ||
    balanceAt.initialLoading

  if (isLoadingActions) {
    return <Text size={10} weight={500} children="Loading..." />
  }

  const showHintEnacted = Boolean(txEnact.isSuccess)
  const showHintObjected =
    !showHintEnacted && (txObject.isSuccess || Boolean(isObjected.data))
  const showHintCanObject =
    !showHintEnacted && Boolean(canObject.data && !isObjected.data)
  const showHintCanNotObject =
    !showHintEnacted && Boolean(!canObject.data && !isObjected.data)

  return (
    <>
      <Hint>
        {showHintEnacted && <>Motion was enacted</>}
        {showHintObjected && (
          <>
            You have objected this motion with <b>{balanceAtFormatted}</b>{' '}
            {governanceSymbol}
          </>
        )}
        {showHintCanObject && (
          <>
            You can object this motion with <b>{balanceAtFormatted}</b>{' '}
            {governanceSymbol}
          </>
        )}
        {showHintCanNotObject && (
          <>
            You didn’t have {governanceSymbol} when the motion started to object
            it
          </>
        )}
      </Hint>

      {!txEnact.isEmpty && <TxRow label="Enact transaction:" tx={txEnact} />}
      {!txObject.isEmpty && (
        <TxRow label="Objection transaction:" tx={txObject} />
      )}

      {!txEnact.isSuccess && (
        <Actions>
          <Button
            size="sm"
            children="Submit objection"
            disabled={!canObject.data}
            onClick={txObject.send}
            loading={txObject.isPending}
          />
          {motion.status === MotionStatus.PENDING && (
            <Button
              size="sm"
              variant="outlined"
              children="Enact"
              onClick={txEnact.send}
              loading={txEnact.isPending}
            />
          )}
        </Actions>
      )}
    </>
  )
}

function AuthStub() {
  const checkWalletConnect = useCheckWalletConnect()
  return (
    <>
      <Hint>Connect your wallet to interact with this motion</Hint>
      <Actions>
        <Button
          size="sm"
          children="Connect wallet"
          onClick={checkWalletConnect}
        />
      </Actions>
    </>
  )
}

export function MotionDetailedActions({ motion, onFinish }: Props) {
  const { isWalletConnected } = useWalletInfo()

  if (!isWalletConnected) return <AuthStub />

  return <ActionsBody motion={motion} onFinish={onFinish} />
}
