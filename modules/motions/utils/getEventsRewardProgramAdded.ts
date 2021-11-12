import type { ContractTypeRewardProgramRegistry } from 'modules/blockChain/contracts'

type RewardProgramAddedEvent = [string, string] & {
  _rewardProgram: string
  _title: string
  _evmScriptFactory: string
  _evmScriptCallData: string
  _evmScript: string
}

export async function getEventsRewardProgramAdded(
  motionContract: ContractTypeRewardProgramRegistry,
) {
  const filter = motionContract.filters.RewardProgramAdded()
  const events = await motionContract.queryFilter(filter)
  return events.map(e =>
    e.decode!(e.data, e.topics),
  ) as RewardProgramAddedEvent[]
}
