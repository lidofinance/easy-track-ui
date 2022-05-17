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
        chainId,
        referalPartnersRegistry,
      )
      return events.map(event => ({
        title: event._title,
        address: event._rewardProgram,
      }))
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}

export function useReferralPartnersActual() {
  const { chainId } = useWeb3()
  const partnersAll = useReferralPartnersAll()
  const referalPartnersRegistry = ContractReferralPartnersRegistry.useRpc()

  return useSWR(
    `referral-partners-actual-${chainId}-${referalPartnersRegistry.address}-${
      partnersAll.data ? 'named' : 'not_named'
    }`,
    async () => {
      const addresses = await referalPartnersRegistry.getRewardPrograms()
      if (partnersAll.data) {
        return partnersAll.data.filter(
          p => addresses.findIndex(addr => addr === p.address) !== -1,
        )
      }
      return addresses.map(address => ({ title: address, address }))
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
