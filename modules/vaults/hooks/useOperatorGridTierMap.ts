import { BigNumber } from 'ethers'
import { ContractOperatorGrid } from 'modules/blockChain/contracts'
import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'
import { useCallback } from 'react'

export type Tier = {
  operator: string
  shareLimit: BigNumber
  liabilityShares: BigNumber
  reserveRatioBP: number
  forcedRebalanceThresholdBP: number
  infraFeeBP: number
  liquidityFeeBP: number
  reservationFeeBP: number
}
export const useOperatorGridTierMap = (totalTiersCount: number | undefined) => {
  const [tierMap, setState] = useSimpleReducer<
    Record<string, Tier | null | undefined>
  >({})
  const operatorGrid = ContractOperatorGrid.useRpc()

  const getOperatorGridTier = useCallback(
    async (tierId: string) => {
      const tierIdNum = parseInt(tierId)
      if (!totalTiersCount || isNaN(tierIdNum) || tierIdNum < 0) {
        return null
      }

      if (tierMap[tierIdNum] !== undefined) {
        return tierMap[tierIdNum] as Tier | null
      }

      if (tierIdNum >= totalTiersCount) {
        return null
      }

      try {
        const tier = await operatorGrid.tier(tierId)
        setState({ [tierIdNum]: tier })
        return tier
      } catch (error) {
        setState({ [tierIdNum]: null })
        return null
      }
    },
    [tierMap, totalTiersCount, operatorGrid, setState],
  )

  return {
    tierMap,
    getOperatorGridTier,
  }
}
