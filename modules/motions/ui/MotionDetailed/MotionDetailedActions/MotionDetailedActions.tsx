import { formatEther } from 'ethers/lib/utils'
import { useCallback } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
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
import { useMotionDetailed } from 'modules/motions/hooks'

import { Text } from 'modules/shared/ui/Common/Text'
import {
  Actions,
  Hint,
  TxHint,
  TxStatus,
  ButtonStyled,
} from './MotionDetailedActionsStyle'

import { Motion, MotionStatus } from 'modules/motions/types'
import {
  getEventMotionCreated,
  getContractMethodParams,
  estimateGasFallback,
} from 'modules/motions/utils'

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
  const { walletAddress } = useWeb3()
  const contractEasyTrack = ContractEasyTrack.useWeb3()
  const { data: governanceSymbol } = useGovernanceSymbol()
  const { isOverPeriodLimit } = useMotionDetailed()

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
          <ButtonStyled
            size="sm"
            children="Submit objection"
            disabled={!canObject.data || isOverPeriodLimit}
            onClick={txObject.send}
            loading={txObject.isPending}
          />
          {motion.status === MotionStatus.PENDING && (
            <ButtonStyled
              size="sm"
              variant="outlined"
              children="Enact"
              onClick={txEnact.send}
              loading={txEnact.isPending}
              disabled={isOverPeriodLimit}
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
        <ButtonStyled
          size="sm"
          children="Connect wallet"
          onClick={checkWalletConnect}
        />
      </Actions>
    </>
  )
}

export function MotionDetailedActions({ motion, onFinish }: Props) {
  const { isWalletConnected } = useWeb3()

  if (!isWalletConnected) return <AuthStub />

  return <ActionsBody motion={motion} onFinish={onFinish} />
}
