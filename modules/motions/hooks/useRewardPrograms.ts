import { useMemo } from 'react'
import { useSWR, SWRResponse } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractRewardProgramRegistry } from 'modules/blockChain/contracts'

type RewardProgram = {
  title: string
  address: string
}

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
export function useRewardProgramsAll() {
  const { chainId } = useWeb3()
  const rewardProgramRegistry = ContractRewardProgramRegistry.useRpc()

  return useSWR(
    `reward-programs-all-${chainId}-${rewardProgramRegistry.address}`,
    async () => {
      const programs = await rewardProgramRegistry.getRewardPrograms()
      return programs.map(address => ({
        title: address,
        address,
      }))
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}

/**
 * @deprecated
 */
export function useRewardProgramsActual() {
  const { chainId } = useWeb3()
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

/**
 * @deprecated
 */
export function useRewardProgramsMapAll() {
  const partners = useRewardProgramsAll()
  return useRewardProgramsMap(partners)
}

/**
 * @deprecated
 */
export function useRewardProgramsMapActual() {
  const partners = useRewardProgramsActual()
  return useRewardProgramsMap(partners)
}
