import { useCallback } from 'react'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { useCheckWalletConnect } from 'modules/blockChain/hooks/useCheckWalletConnect'

import { CancelButton } from './MotionDetailedCancelButtonStyle'
import TrashSVG from 'assets/icons/trash.svg.react'

import type { Motion } from 'modules/motions/types'

type Props = {
  motion: Motion
}

export function MotionDetailedCancelButton({ motion }: Props) {
  const contractEasyTrack = ContractEasyTrack.useWeb3()
  const checkWalletConnect = useCheckWalletConnect()

  // Cancel Motion
  const handleCancel = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      const res = await contractEasyTrack.cancelMotion(motion.id, {
        gasLimit: 500000,
      })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, contractEasyTrack, motion.id])

  return (
    <CancelButton onClick={handleCancel}>
      <TrashSVG />
    </CancelButton>
  )
}
