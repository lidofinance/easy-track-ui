import { useMemo } from 'react'
import { getMotionProgress } from 'modules/motions/utils/getMotionProgress'
import type { Motion } from '../types'
import { useGovernanceTokenData } from 'modules/tokens/hooks/useGovernanceTokenData'

export function useMotionProgress(motion: Motion) {
  const { data: tokenData, initialLoading: isLoadingSupply } =
    useGovernanceTokenData()

  const formatted = useMemo(() => {
    return !isLoadingSupply && tokenData?.totalSupply
      ? getMotionProgress(motion, tokenData.totalSupply)
      : null
  }, [isLoadingSupply, motion, tokenData?.totalSupply])

  return formatted
}
