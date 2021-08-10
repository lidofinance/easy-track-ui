import { ContractRewardProgramRegistry } from 'modules/blockChain/contracts'
import { useSWR } from 'modules/shared/hooks/useSwr'
import { getEventsRewardProgramAdded } from '../utils/getEventsRewardProgramAdded'

export function useRewardPrograms() {
  const rewardProgramRegistry = ContractRewardProgramRegistry.useRpc()

  return useSWR('reward-programs', async () => {
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
  })
}
