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
      const events = await getEventsRewardProgramAdded(
        chainId,
        rewardProgramRegistry,
      )
      return events.map(event => ({
        title: event._title,
        address: event._rewardProgram,
      }))
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}

export function useRewardProgramsActual() {
  const chainId = useWeb3()
  const programsAll = useRewardProgramsAll()
  const rewardProgramRegistry = ContractRewardProgramRegistry.useRpc()

  return useSWR(
    `reward-programs-actual-${chainId}-${rewardProgramRegistry.address}-${
      programsAll.data ? 'named' : 'not_named'
    }`,
    async () => {
      const addresses = await rewardProgramRegistry.getRewardPrograms()
      if (programsAll.data) {
        return programsAll.data.filter(
          p => addresses.findIndex(addr => addr === p.address) !== -1,
        )
      }
      return addresses.map(address => ({ title: address, address }))
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
