import { useCallback } from 'react'
import { useContractMotionWeb3 } from 'modules/blockChain/hooks/useContractMotion'
import { useCheckWalletConnect } from 'modules/blockChain/hooks/useCheckWalletConnect'

import { CancelButton } from './MotionDetailedCancelButtonStyle'
import TrashSVG from 'assets/icons/trash.svg.react'

import type { Motion } from 'modules/motions/types'

type Props = {
  motion: Motion
}

export function MotionDetailedCancelButton({ motion }: Props) {
  const motionContract = useContractMotionWeb3()
  const checkWalletConnect = useCheckWalletConnect()

  // Cancel Motion
  const handleCancel = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      const res = await motionContract.cancelMotion(motion.id, {
        gasLimit: 120000,
      })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, motionContract, motion.id])

  return (
    <CancelButton onClick={handleCancel}>
      <TrashSVG />
    </CancelButton>
  )
}
