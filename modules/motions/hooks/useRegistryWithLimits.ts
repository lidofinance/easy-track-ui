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
  ContractAllowedRecipientDaiRegistry,
} from 'modules/blockChain/contracts'
import { getEventsRecipientAdded } from 'modules/motions/utils'
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
  [MotionType.AllowedRecipientRemove]: ContractAllowedRecipientRegistry,
  [MotionType.AllowedRecipientAdd]: ContractAllowedRecipientRegistry,
  [MotionType.AllowedRecipientTopUpDai]: ContractAllowedRecipientDaiRegistry,
  [MotionType.AllowedRecipientRemoveDai]: ContractAllowedRecipientDaiRegistry,
  [MotionType.AllowedRecipientAddDai]: ContractAllowedRecipientDaiRegistry,
}

type HookArgs = {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE
}

function useRecipientMap(programs: SWRResponse<AllowedRecipient[] | null>) {
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

export function useRecipientAll({ registryType }: HookArgs) {
  const { chainId } = useWeb3()
  const registry = REGISTRY_WITH_LIMITS_BY_MOTION_TYPE[registryType].useRpc()

  return useSWR(
    `single-allowed-recipients-all-${chainId}-${registry.address || ''}`,
    async () => {
      const events = await getEventsRecipientAdded(chainId, registry)
      return events.map(event => ({
        title: event._title || event._recipient, // for allowed recipient from referral
        address: event._recipient,
      }))
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}

export function useRecipientActual({ registryType }: HookArgs) {
  const chainId = useWeb3()
  const recipientsAll = useRecipientAll({ registryType })
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

export function useRecipientMapAll({ registryType }: HookArgs) {
  const partners = useRecipientAll({ registryType })
  return useRecipientMap(partners)
}

export function usePeriodLimitsData({ registryType }: HookArgs) {
  const registry = REGISTRY_WITH_LIMITS_BY_MOTION_TYPE[registryType].useRpc()

  return usePeriodLimitsInfo({
    contract: registry,
  })
}
