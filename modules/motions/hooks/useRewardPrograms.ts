import { ContractRewardProgramRegistry } from 'modules/blockChain/contracts'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useSWR } from 'modules/network/hooks/useSwr'
import { getEventsRewardProgramAdded } from '../utils/getEventsRewardProgramAdded'

export function useRewardPrograms() {
  const chainId = useCurrentChain()
  const rewardProgramRegistry = ContractRewardProgramRegistry.useRpc()

  return useSWR(
    `reward-programs-${chainId}-${rewardProgramRegistry.address}`,
    async () => {
      const [rewardProgramsData, events] = await Promise.all([
        rewardProgramRegistry.getRewardPrograms(),
        getEventsRewardProgramAdded(rewardProgramRegistry),
      ])
      return rewardProgramsData.map(rewardProgram => {
        const event = events.find(e => e._rewardProgram === rewardProgram)
        return {
          title: event?._title || rewardProgram,
          address: rewardProgram,
        }
      })
    },
  )
}
