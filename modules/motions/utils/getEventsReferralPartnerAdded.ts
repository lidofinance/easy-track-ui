import type { ContractTypeReferralPartnersRegistry } from 'modules/blockChain/contracts'

type RewardProgramAddedEvent = [string, string] & {
  _referralPartner: string
  _title: string
  _evmScriptFactory: string
  _evmScriptCallData: string
  _evmScript: string
}

export async function getEventsReferralPartnerAdded(
  motionContract: ContractTypeReferralPartnersRegistry,
) {
  const filter = motionContract.filters.ReferralPartnerAdded()
  const events = await motionContract.queryFilter(filter)
  return events.map(e =>
    e.decode!(e.data, e.topics),
  ) as RewardProgramAddedEvent[]
}
