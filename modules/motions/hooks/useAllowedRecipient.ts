import { useMemo } from 'react'
import { useSWR, SWRResponse } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractAllowedRecipientRegistry } from 'modules/blockChain/contracts'
import { usePeriodLimitsInfo } from 'modules/motions/hooks/usePeriodLimitsInfo'
import {
  getLimits,
  getEventsAllowedRecipientAdded,
} from 'modules/motions/utils'

type AllowedRecipient = {
  title: string
  address: string
}

function useAllowedRecipientMap(
  programs: SWRResponse<AllowedRecipient[] | null>,
) {
  const result = useMemo(() => {
    if (!programs.data) return null
    return programs.data.reduce(
      (res, p) => ({ [p.address]: p.title, ...res }),
      {} as Record<string, string>,
    )
  }, [programs.data])

  return {
    ...programs,
    data: result,
  }
}

export function useAllowedRecipientAll() {
  const { chainId } = useWeb3()
  const allowedRecipientRegistry = ContractAllowedRecipientRegistry.useRpc()

  return useSWR(
    `allowed-recipients-all-${chainId}-${allowedRecipientRegistry.address}`,
    async () => {
      const events = await getEventsAllowedRecipientAdded(
        chainId,
        allowedRecipientRegistry,
      )
      return events.map(event => ({
        title: event._title,
        address: event._recipient,
      }))
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}

export function useAllowedRecipientActual() {
  const chainId = useWeb3()
  const recipientsAll = useAllowedRecipientAll()
  const allowedRecipientRegistry = ContractAllowedRecipientRegistry.useRpc()

  return useSWR(
    `reward-programs-actual-${chainId}-${allowedRecipientRegistry.address}-${
      recipientsAll.data ? 'named' : 'not_named'
    }`,
    async () => {
      const addresses = await allowedRecipientRegistry.getAllowedRecipients()
      if (recipientsAll.data) {
        return recipientsAll.data.filter(
          p => addresses.findIndex(addr => addr === p.address) !== -1,
        )
      }
      return addresses.map(address => ({ title: address, address }))
    },
  )
}

export function useAllowedRecipientMapAll() {
  const partners = useAllowedRecipientActual()
  return useAllowedRecipientMap(partners)
}

export function useAllowedRecipientMapActual() {
  const partners = useAllowedRecipientActual()
  return useAllowedRecipientMap(partners)
}

export function useAllowedRecipientLimits() {
  const { chainId } = useWeb3()
  const allowedRecipientRegistry = ContractAllowedRecipientRegistry.useRpc()

  return useSWR(
    `allowed-recipients-limits-${chainId}-${allowedRecipientRegistry.address}`,
    async () => {
      const data = await getLimits(allowedRecipientRegistry)
      return data
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}

export function useAllowedRecipientPeriodLimitsData() {
  const allowedRecipientRegistry = ContractAllowedRecipientRegistry.useRpc()

  return usePeriodLimitsInfo({
    address: allowedRecipientRegistry.address,
    contract: allowedRecipientRegistry,
    swrKey: 'allowed-recipients-period-limits-data',
  })
}
