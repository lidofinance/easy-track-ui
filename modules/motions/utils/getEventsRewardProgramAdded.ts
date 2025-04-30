import { get } from 'lodash'
import { CHAINS } from '@lido-sdk/constants'
import * as TypeChain from 'generated'

export type ContractTypeRewardProgramRegistry =
  TypeChain.RewardProgramRegistryAbi

type RewardProgramAddedEvent = [string, string] & {
  _rewardProgram: string
  _title: string
  _evmScriptFactory: string
  _evmScriptCallData: string
  _evmScript: string
}

const FROM_BLOCK = {
  [CHAINS.Mainnet]: 13676800,
}

export async function getEventsRewardProgramAdded(
  chainId: CHAINS,
  motionContract: ContractTypeRewardProgramRegistry,
) {
  const filter = motionContract.filters.RewardProgramAdded()
  const events = await motionContract.queryFilter(
    filter,
    get(FROM_BLOCK, chainId, undefined),
  )
  return events.map(e =>
    e.decode!(e.data, e.topics),
  ) as RewardProgramAddedEvent[]
}
