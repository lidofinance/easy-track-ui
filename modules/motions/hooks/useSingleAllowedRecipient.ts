import { useMemo } from 'react'
import { useSWR, SWRResponse } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractSingleAllowedRecipientRegistry } from 'modules/blockChain/contracts'
import { usePeriodLimitsInfo } from 'modules/motions/hooks/usePeriodLimitsInfo'
import {
  getLimits,
  getEventsSingleAllowedRecipientAdded,
} from 'modules/motions/utils'

type AllowedRecipient = {
  title: string
  address: string
}

function useSingleAllowedRecipientMap(
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

export function useSingleAllowedRecipientAll() {
  const { chainId } = useWeb3()
  const singleAllowedRecipientRegistry =
    ContractSingleAllowedRecipientRegistry.useRpc()

  return useSWR(
    `single-allowed-recipients-all-${chainId}-${singleAllowedRecipientRegistry.address}`,
    async () => {
      const events = await getEventsSingleAllowedRecipientAdded(
        chainId,
        singleAllowedRecipientRegistry,
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

export function useSingleAllowedRecipientActual() {
  const chainId = useWeb3()
  const recipientsAll = useSingleAllowedRecipientAll()
  const singleAllowedRecipientRegistry =
    ContractSingleAllowedRecipientRegistry.useRpc()

  return useSWR(
    `single-allowed-recipients-actual-${chainId}-${
      singleAllowedRecipientRegistry.address
    }-${recipientsAll.data ? 'named' : 'not_named'}`,
    async () => {
      const addresses =
        await singleAllowedRecipientRegistry.getAllowedRecipients()
      if (recipientsAll.data) {
        return recipientsAll.data.filter(
          p => addresses.findIndex(addr => addr === p.address) !== -1,
        )
      }
      return addresses.map(address => ({ title: address, address }))
    },
  )
}

export function useSingleAllowedRecipientMapAll() {
  const partners = useSingleAllowedRecipientActual()
  return useSingleAllowedRecipientMap(partners)
}

export function useAllowedRecipientMapActual() {
  const partners = useSingleAllowedRecipientActual()
  return useSingleAllowedRecipientMap(partners)
}

export function useSingleAllowedRecipientLimits() {
  const { chainId } = useWeb3()
  const allowedRecipientRegistry =
    ContractSingleAllowedRecipientRegistry.useRpc()

  return useSWR(
    `single-allowed-recipients-limits-${chainId}-${allowedRecipientRegistry.address}`,
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

export function useSingleAllowedRecipientPeriodLimitsData() {
  const singleAllowedRecipientRegistry =
    ContractSingleAllowedRecipientRegistry.useRpc()

  return usePeriodLimitsInfo({
    address: singleAllowedRecipientRegistry.address,
    contract: singleAllowedRecipientRegistry,
    swrKey: 'single-allowed-recipients-period-limits-data',
  })
}
