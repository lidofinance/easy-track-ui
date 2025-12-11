import { formatEther } from 'ethers/lib/utils'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  ContractEasyTrack,
  ContractGovernanceToken,
} from 'modules/blockChain/contracts'
import { useCheckWalletConnect } from 'modules/blockChain/hooks/useCheckWalletConnect'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'
import { TransactionSender } from 'modules/blockChain/hooks/useTransactionSender'
import { useMotionDetailed } from 'modules/motions/providers/hooks/useMotionDetaled'

import { Text } from 'modules/shared/ui/Common/Text'
import {
  Actions,
  Hint,
  TxHint,
  TxStatus,
  ButtonStyled,
} from './MotionDetailedActionsStyle'

import { Motion, MotionStatus } from 'modules/motions/types'

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
}

function ActionsBody({ motion }: Props) {
  const { walletAddress } = useWeb3()
  const { data: governanceSymbol } = useGovernanceSymbol()
  const { isOverPeriodLimit, txEnact, txObject } = useMotionDetailed()

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

export function MotionDetailedActions({ motion }: Props) {
  const { isWalletConnected } = useWeb3()

  if (!isWalletConnected) return <AuthStub />

  return <ActionsBody motion={motion} />
}
