import { useMemo } from 'react'
import { useSWR, SWRResponse } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractLegoDAIRegistry } from 'modules/blockChain/contracts'
import { usePeriodLimitsInfo } from 'modules/motions/hooks/usePeriodLimitsInfo'
import {
  getLimits,
  getEventsLegoDAIRecipientAdded,
} from 'modules/motions/utils'

type AllowedRecipient = {
  title: string
  address: string
}

function useLegoDAIMap(programs: SWRResponse<AllowedRecipient[] | null>) {
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

export function useLegoDAIAll() {
  const { chainId } = useWeb3()
  const legoDAIRegistry = ContractLegoDAIRegistry.useRpc()

  return useSWR(
    `single-allowed-recipients-all-${chainId}-${legoDAIRegistry.address}`,
    async () => {
      const events = await getEventsLegoDAIRecipientAdded(
        chainId,
        legoDAIRegistry,
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

export function useLegoDAIActual() {
  const chainId = useWeb3()
  const recipientsAll = useLegoDAIAll()
  const legoDAIRegistry = ContractLegoDAIRegistry.useRpc()

  return useSWR(
    `single-allowed-recipients-actual-${chainId}-${legoDAIRegistry.address}-${
      recipientsAll.data ? 'named' : 'not_named'
    }`,
    async () => {
      const addresses = await legoDAIRegistry.getAllowedRecipients()
      if (recipientsAll.data) {
        return recipientsAll.data.filter(
          p => addresses.findIndex(addr => addr === p.address) !== -1,
        )
      }
      return addresses.map(address => ({ title: address, address }))
    },
  )
}

export function useLegoDAIMapAll() {
  const partners = useLegoDAIActual()
  return useLegoDAIMap(partners)
}

export function useLEGODAILimits() {
  const { chainId } = useWeb3()
  const allowedRecipientRegistry = ContractLegoDAIRegistry.useRpc()

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

export function useLegoDAIPeriodLimitsData() {
  const legoDAIRegistry = ContractLegoDAIRegistry.useRpc()

  return usePeriodLimitsInfo({
    address: legoDAIRegistry.address,
    contract: legoDAIRegistry,
    swrKey: 'lego-dai-period-limits-data',
  })
}
