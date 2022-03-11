import { useMemo } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { ContractRewardProgramRegistry } from 'modules/blockChain/contracts'
import { getEventsRewardProgramAdded } from '../utils/getEventsRewardProgramAdded'

export function useRewardPrograms() {
  const chainId = useCurrentChain()
  const rewardProgramRegistry = ContractRewardProgramRegistry.useRpc()

  return useSWR(
    `reward-programs-${chainId}-${rewardProgramRegistry.address}`,
    async () => {
      const events = await getEventsRewardProgramAdded(rewardProgramRegistry)
      return events.map(event => ({
        title: event._title,
        address: event._rewardProgram,
      }))
    },
  )
}

export function useRewardProgramsMap() {
  const programs = useRewardPrograms()

  const result = useMemo(() => {
    if (!programs.data) return null
    return programs.data.reduce(
      (res, p) => ({ [p.address]: p.title, ...res }),
      {} as Record<string, string>,
    )
  }, [programs.data])

  return {
    ...programs,
    data: result,
  }
}
