import { useMemo } from 'react'
import { useLDOTotalSupply } from 'modules/tokens/hooks/useLDOTotalSupply'
import { getMotionProgress } from 'modules/motions/utils/getMotionProgress'
import type { Motion } from '../types'

export function useMotionProgress(motion: Motion) {
  const { data: totalSupply, initialLoading: isLoadingSupply } =
    useLDOTotalSupply()

  const formatted = useMemo(() => {
    return !isLoadingSupply && totalSupply
      ? getMotionProgress(motion, totalSupply)
      : null
  }, [isLoadingSupply, motion, totalSupply])

  return formatted
}
