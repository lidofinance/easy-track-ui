import { useMemo } from 'react'
import { useSWR, SWRResponse } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractRewardProgramRegistry } from 'modules/blockChain/contracts'
import { getEventsRewardProgramAdded } from '../utils/getEventsRewardProgramAdded'

type RewardProgram = {
  title: string
  address: string
}

function useRewardProgramsMap(programs: SWRResponse<RewardProgram[] | null>) {
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

export function useRewardProgramsAll() {
  const { chainId } = useWeb3()
  const rewardProgramRegistry = ContractRewardProgramRegistry.useRpc()

  return useSWR(
    `reward-programs-all-${chainId}-${rewardProgramRegistry.address}`,
    async () => {
      const events = await getEventsRewardProgramAdded(rewardProgramRegistry)
      return events.map(event => ({
        title: event._title,
        address: event._rewardProgram,
      }))
    },
  )
}

export function useRewardProgramsActual() {
  const chainId = useWeb3()
  const programsAll = useRewardProgramsAll()
  const rewardProgramRegistry = ContractRewardProgramRegistry.useRpc()

  return useSWR(
    programsAll.data
      ? `reward-programs-actual-${chainId}-${rewardProgramRegistry.address}`
      : null,
    async () => {
      if (!programsAll.data) return null
      const programsActual = await rewardProgramRegistry.getRewardPrograms()
      return programsAll.data.filter(
        p => programsActual.findIndex(addr => addr === p.address) !== -1,
      )
    },
  )
}

export function useRewardProgramsMapAll() {
  const partners = useRewardProgramsAll()
  return useRewardProgramsMap(partners)
}

export function useRewardProgramsMapActual() {
  const partners = useRewardProgramsActual()
  return useRewardProgramsMap(partners)
}
