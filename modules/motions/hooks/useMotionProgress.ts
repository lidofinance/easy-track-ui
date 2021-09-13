import { useMemo } from 'react'
import { useGovernanceTotalSupply } from 'modules/tokens/hooks/useGovernanceTotalSupply'
import { getMotionProgress } from 'modules/motions/utils/getMotionProgress'
import type { Motion } from '../types'

export function useMotionProgress(motion: Motion) {
  const { data: totalSupply, initialLoading: isLoadingSupply } =
    useGovernanceTotalSupply()

  const formatted = useMemo(() => {
    return !isLoadingSupply && totalSupply
      ? getMotionProgress(motion, totalSupply)
      : null
  }, [isLoadingSupply, motion, totalSupply])

  return formatted
}
