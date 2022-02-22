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
      const [referralPartners, events] = await Promise.all([
        referalPartnersRegistry.getRewardPrograms(),
        getEventsReferralPartnerAdded(referalPartnersRegistry),
      ])
      return referralPartners.map(rewardProgram => {
        const event = events.find(e => e._rewardProgram === rewardProgram)
        return {
          title: event?._title || rewardProgram,
          address: rewardProgram,
        }
      })
    },
  )
}
