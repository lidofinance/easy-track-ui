import { get } from 'lodash'
import { CHAINS } from '@lido-sdk/constants'
import type { ContractTypeReferralPartnersRegistry } from 'modules/blockChain/contracts'

type RewardProgramAddedEvent = [string, string] & {
  _rewardProgram: string
  _title: string
  _evmScriptFactory: string
  _evmScriptCallData: string
  _evmScript: string
}

const FROM_BLOCK = {
  [CHAINS.Mainnet]: 14441666,
}

export async function getEventsReferralPartnerAdded(
  chainId: CHAINS,
  motionContract: ContractTypeReferralPartnersRegistry,
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
