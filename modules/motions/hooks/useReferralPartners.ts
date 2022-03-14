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
      const events = await getEventsReferralPartnerAdded(
        referalPartnersRegistry,
      )
      return events.map(event => ({
        title: event._title,
        address: event._rewardProgram,
      }))
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
