import { ContractReferralPartnersRegistry } from 'modules/blockChain/contracts'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useSWR } from 'modules/network/hooks/useSwr'
import { getEventsReferralPartnerAdded } from '../utils/getEventsReferralPartnerAdded'

export function useReferralPartners() {
  const chainId = useCurrentChain()
  const referalPartnersRegistry = ContractReferralPartnersRegistry.useRpc()

  return useSWR(
    `referral-partners-${chainId}-${referalPartnersRegistry.address}`,
    async () => {
      const [rewardProgramsData, events] = await Promise.all([
        referalPartnersRegistry.getReferralPartners(),
        getEventsReferralPartnerAdded(referalPartnersRegistry),
      ])
      return rewardProgramsData.map(rewardProgram => {
        const event = events.find(e => e._referralPartner === rewardProgram)
        return {
          title: event?._title || rewardProgram,
          address: rewardProgram,
        }
      })
    },
  )
}
