import { useMemo } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { ContractReferralPartnersRegistry } from 'modules/blockChain/contracts'
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
      return referralPartners.map(referralPartner => {
        const event = events.find(e => e._rewardProgram === referralPartner)
        return {
          title: event?._title || referralPartner,
          address: referralPartner,
        }
      })
    },
  )
}

export function useReferralPartnersMap() {
  const parters = useReferralPartners()

  const result = useMemo(() => {
    if (!parters.data) return null
    return parters.data.reduce(
      (res, p) => ({ [p.address]: p.title, ...res }),
      {} as Record<string, string>,
    )
  }, [parters.data])

  return {
    ...parters,
    data: result,
  }
}
