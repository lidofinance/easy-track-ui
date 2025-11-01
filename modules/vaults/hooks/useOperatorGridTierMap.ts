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
    Record<string, Tier | undefined>
  >({})
  const operatorGrid = ContractOperatorGrid.useRpc()

  const getOperatorGridTier = useCallback(
    async (tierId: string) => {
      const tierIdNum = parseInt(tierId)
      if (
        !totalTiersCount ||
        isNaN(tierIdNum) ||
        tierIdNum < 0 ||
        tierIdNum >= totalTiersCount
      ) {
        return null
      }

      if (tierMap[tierIdNum]) {
        return tierMap[tierIdNum]!
      }

      const tier = await operatorGrid.tier(tierId)

      setState({ [tierIdNum]: tier })

      return tier
    },
    [tierMap, totalTiersCount, operatorGrid, setState],
  )

  return {
    tierMap,
    getOperatorGridTier,
  }
}
