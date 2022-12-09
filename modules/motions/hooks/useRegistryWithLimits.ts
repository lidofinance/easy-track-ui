import { useMemo } from 'react'
import { useSWR, SWRResponse } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  ContractLegoLDORegistry,
  ContractLegoDAIRegistry,
  ContractRccDAIRegistry,
  ContractPmlDAIRegistry,
  ContractAtcDAIRegistry,
  ContractGasFunderETHRegistry,
  ContractAllowedRecipientRegistry,
} from 'modules/blockChain/contracts'
import { getLimits, getEventsRecipientAdded } from 'modules/motions/utils'
import { MotionType } from 'modules/motions/types'

import { usePeriodLimitsInfo } from './usePeriodLimitsInfo'

type AllowedRecipient = {
  title: string
  address: string
}

export const REGISTRY_WITH_LIMITS_BY_MOTION_TYPE = {
  [MotionType.LegoLDOTopUp]: ContractLegoLDORegistry,
  [MotionType.LegoDAITopUp]: ContractLegoDAIRegistry,
  [MotionType.RccDAITopUp]: ContractRccDAIRegistry,
  [MotionType.PmlDAITopUp]: ContractPmlDAIRegistry,
  [MotionType.AtcDAITopUp]: ContractAtcDAIRegistry,
  [MotionType.GasFunderETHTopUp]: ContractGasFunderETHRegistry,
  [MotionType.AllowedRecipientTopUp]: ContractAllowedRecipientRegistry,
}

type HookArgs = {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE
}

function useMap(programs: SWRResponse<AllowedRecipient[] | null>) {
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

export function useAll({ registryType }: HookArgs) {
  const { chainId } = useWeb3()
  const registry = REGISTRY_WITH_LIMITS_BY_MOTION_TYPE[registryType].useRpc()

  return useSWR(
    `single-allowed-recipients-all-${chainId}-${registry.address || ''}`,
    async () => {
      const events = await getEventsRecipientAdded(chainId, registry)
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

export function useActual({ registryType }: HookArgs) {
  const chainId = useWeb3()
  const recipientsAll = useAll({ registryType })
  const registry = REGISTRY_WITH_LIMITS_BY_MOTION_TYPE[registryType].useRpc()

  return useSWR(
    `single-allowed-recipients-actual-${chainId}-${registry.address}-${
      recipientsAll.data ? 'named' : 'not_named'
    }`,
    async () => {
      const addresses = await registry.getAllowedRecipients()
      if (recipientsAll.data) {
        return recipientsAll.data.filter(
          p => addresses.findIndex(addr => addr === p.address) !== -1,
        )
      }
      return addresses.map(address => ({ title: address, address }))
    },
  )
}

export function useMapAll({ registryType }: HookArgs) {
  const partners = useActual({ registryType })
  return useMap(partners)
}

export function useLimits({ registryType }: HookArgs) {
  const { chainId } = useWeb3()
  const registry = REGISTRY_WITH_LIMITS_BY_MOTION_TYPE[registryType].useRpc()

  return useSWR(
    `single-allowed-recipients-limits-${chainId}-${registry.address}`,
    async () => {
      const data = await getLimits(registry)
      return data
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}

export function usePeriodLimitsData({ registryType }: HookArgs) {
  const registry = REGISTRY_WITH_LIMITS_BY_MOTION_TYPE[registryType].useRpc()

  return usePeriodLimitsInfo({
    address: registry.address,
    contract: registry,
    swrKey: 'registry-period-limits-data',
  })
}
