import { useCallback } from 'react'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { useTransactionSender } from 'modules/blockChain/hooks/useTransactionSender'

import { Loader } from '@lidofinance/lido-ui'
import { Tooltip } from 'modules/shared/ui/Common/Tooltip'
import { CancelButton, Wrap } from './MotionDetailedCancelButtonStyle'
import TrashSVG from 'assets/icons/trash.svg.react'

import type { Motion } from 'modules/motions/types'
import { estimateGasFallback } from 'modules/motions/utils/estimateGasFallback'

type Props = {
  motion: Motion
  onFinish?: () => void
}

export function MotionDetailedCancelButton({ motion, onFinish }: Props) {
  const contractEasyTrack = ContractEasyTrack.useWeb3()

  // Cancel Motion
  const populateCancel = useCallback(async () => {
    const gasLimit = await estimateGasFallback(
      contractEasyTrack.estimateGas.cancelMotion(motion.id),
    )
    const tx = await contractEasyTrack.populateTransaction.cancelMotion(
      motion.id,
      { gasLimit },
    )
    return tx
  }, [contractEasyTrack, motion.id])

  const txCancel = useTransactionSender(populateCancel, { onFinish })

  return (
    <Wrap>
      <Tooltip position="top" tooltip="Cancel">
        <CancelButton
          isActive={txCancel.isEmpty}
          onClick={txCancel.isEmpty ? txCancel.send : undefined}
        >
          {txCancel.isPending ? <Loader size="small" /> : <TrashSVG />}
        </CancelButton>
      </Tooltip>
    </Wrap>
  )
}
