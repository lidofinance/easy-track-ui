import { useMemo } from 'react'
import { useSWR, SWRResponse } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  ContractLegoLDORegistry,
  ContractLegoStablesRegistry,
  ContractPmlStablesRegistry,
  ContractAtcStablesRegistry,
  ContractGasFunderETHRegistry,
  ContractAllowedRecipientRegistry,
  ContractAllowedRecipientReferralDaiRegistry,
  ContractAllowedRecipientTrpLdoRegistry,
  ContractStethRewardProgramRegistry,
  ContractStethGasSupplyRegistry,
  ContractRewardsShareProgramRegistry,
  ContractRccStablesRegistry,
  ContractSandboxStablesAllowedRecipientRegistry,
  ContractRccStethAllowedRecipientsRegistry,
  ContractPmlStethAllowedRecipientsRegistry,
  ContractAtcStethAllowedRecipientsRegistry,
  ContractStonksStethAllowedRecipientsRegistry,
  ContractStonksStablesAllowedRecipientsRegistry,
  ContractAllianceOpsStablesAllowedRecipientsRegistry,
  ContractEcosystemOpsStablesAllowedRecipientsRegistry,
  ContractLabsOpsStablesAllowedRecipientsRegistry,
} from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'

import { usePeriodLimitsInfo } from './usePeriodLimitsInfo'

type AllowedRecipient = {
  title: string
  address: string
}

export const REGISTRY_WITH_LIMITS_BY_MOTION_TYPE = {
  [MotionType.LegoLDOTopUp]: ContractLegoLDORegistry,
  [MotionType.LegoDAITopUp]: ContractLegoStablesRegistry,
  [MotionType.RccDAITopUp]: ContractRccStablesRegistry,
  [MotionType.PmlDAITopUp]: ContractPmlStablesRegistry,
  [MotionType.AtcDAITopUp]: ContractAtcStablesRegistry,
  [MotionType.GasFunderETHTopUp]: ContractGasFunderETHRegistry,
  [MotionType.AllowedRecipientTopUp]: ContractAllowedRecipientRegistry,
  [MotionType.AllowedRecipientRemove]: ContractAllowedRecipientRegistry,
  [MotionType.AllowedRecipientAdd]: ContractAllowedRecipientRegistry,
  [MotionType.AllowedRecipientTopUpReferralDai]:
    ContractAllowedRecipientReferralDaiRegistry,
  [MotionType.AllowedRecipientRemoveReferralDai]:
    ContractAllowedRecipientReferralDaiRegistry,
  [MotionType.AllowedRecipientAddReferralDai]:
    ContractAllowedRecipientReferralDaiRegistry,
  [MotionType.AllowedRecipientTopUpTrpLdo]:
    ContractAllowedRecipientTrpLdoRegistry,
  [MotionType.StethRewardProgramAdd]: ContractStethRewardProgramRegistry,
  [MotionType.StethRewardProgramRemove]: ContractStethRewardProgramRegistry,
  [MotionType.StethRewardProgramTopUp]: ContractStethRewardProgramRegistry,
  [MotionType.StethGasSupplyAdd]: ContractStethGasSupplyRegistry,
  [MotionType.StethGasSupplyRemove]: ContractStethGasSupplyRegistry,
  [MotionType.StethGasSupplyTopUp]: ContractStethGasSupplyRegistry,
  [MotionType.RewardsShareProgramAdd]: ContractRewardsShareProgramRegistry,
  [MotionType.RewardsShareProgramRemove]: ContractRewardsShareProgramRegistry,
  [MotionType.RewardsShareProgramTopUp]: ContractRewardsShareProgramRegistry,
  [MotionType.RccStablesTopUp]: ContractRccStablesRegistry,
  [MotionType.PmlStablesTopUp]: ContractPmlStablesRegistry,
  [MotionType.AtcStablesTopUp]: ContractAtcStablesRegistry,
  [MotionType.SandboxStablesAdd]:
    ContractSandboxStablesAllowedRecipientRegistry,
  [MotionType.SandboxStablesRemove]:
    ContractSandboxStablesAllowedRecipientRegistry,
  [MotionType.SandboxStablesTopUp]:
    ContractSandboxStablesAllowedRecipientRegistry,
  [MotionType.RccStethTopUp]: ContractRccStethAllowedRecipientsRegistry,
  [MotionType.PmlStethTopUp]: ContractPmlStethAllowedRecipientsRegistry,
  [MotionType.AtcStethTopUp]: ContractAtcStethAllowedRecipientsRegistry,
  [MotionType.LegoStablesTopUp]: ContractLegoStablesRegistry,
  [MotionType.StonksStethTopUp]: ContractStonksStethAllowedRecipientsRegistry,
  [MotionType.StonksStablesTopUp]:
    ContractStonksStablesAllowedRecipientsRegistry,
  [MotionType.AllianceOpsStablesTopUp]:
    ContractAllianceOpsStablesAllowedRecipientsRegistry,
  [MotionType.EcosystemOpsStablesTopUp]:
    ContractEcosystemOpsStablesAllowedRecipientsRegistry,
  [MotionType.LabsOpsStablesTopUp]:
    ContractLabsOpsStablesAllowedRecipientsRegistry,
} as const

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

export function useAllowedRecipients({ registryType }: HookArgs) {
  const { chainId } = useWeb3()

  const registry = REGISTRY_WITH_LIMITS_BY_MOTION_TYPE[registryType].useRpc()
  return useSWR(
    `allowed-recipients-${chainId}-${registry.address}`,
    async () => {
      const addresses = await registry.getAllowedRecipients()

      return addresses.map(address => ({ title: address, address }))
    },
  )
}

export function useRecipientMapAll({ registryType }: HookArgs) {
  const partners = useAllowedRecipients({ registryType })
  return useRecipientMap(partners)
}

export function usePeriodLimitsData({ registryType }: HookArgs) {
  const registry = REGISTRY_WITH_LIMITS_BY_MOTION_TYPE[registryType].useRpc()

  return usePeriodLimitsInfo({
    contract: registry,
  })
}
