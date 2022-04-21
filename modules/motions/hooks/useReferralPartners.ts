import { useMemo } from 'react'
import { useSWR, SWRResponse } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractReferralPartnersRegistry } from 'modules/blockChain/contracts'
import { getEventsReferralPartnerAdded } from '../utils/getEventsReferralPartnerAdded'

type ReferralPartner = {
  title: string
  address: string
}

function useReferralPartnersMap(
  partners: SWRResponse<ReferralPartner[] | null>,
) {
  const result = useMemo(() => {
    if (!partners.data) return null
    return partners.data.reduce(
      (res, p) => ({ [p.address]: p.title, ...res }),
      {} as Record<string, string>,
    )
  }, [partners.data])
  return {
    ...partners,
    data: result,
  }
}

export function useReferralPartnersAll() {
  const { chainId } = useWeb3()
  const referalPartnersRegistry = ContractReferralPartnersRegistry.useRpc()

  return useSWR(
    `referral-partners-all-${chainId}-${referalPartnersRegistry.address}`,
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

export function useReferralPartnersActual() {
  const { chainId } = useWeb3()
  const partnersAll = useReferralPartnersAll()
  const referalPartnersRegistry = ContractReferralPartnersRegistry.useRpc()

  return useSWR(
    partnersAll.data
      ? `referral-partners-actual-${chainId}-${referalPartnersRegistry.address}`
      : null,
    async () => {
      if (!partnersAll.data) return null
      const partnersActual = await referalPartnersRegistry.getRewardPrograms()
      return partnersAll.data.filter(
        p => partnersActual.findIndex(addr => addr === p.address) !== -1,
      )
    },
  )
}

export function useReferralPartnersMapAll() {
  const partners = useReferralPartnersAll()
  return useReferralPartnersMap(partners)
}

export function useReferralPartnersMapActual() {
  const partners = useReferralPartnersActual()
  return useReferralPartnersMap(partners)
}
