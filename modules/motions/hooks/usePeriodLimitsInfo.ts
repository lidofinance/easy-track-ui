import { LimitCheckerAbi, EasyTrackAbi } from 'generated'
import { createContractHelpers } from 'modules/blockChain/utils/createContractHelpers'
import {
  ContractLegoStablesRegistry,
  ContractEasyTrack,
  ContractAllowedRecipientRegistry,
  ContractAllowedRecipientReferralDaiRegistry,
  ContractAllowedRecipientTrpLdoRegistry,
  ContractLegoLDORegistry,
  ContractRccStablesRegistry,
  ContractAtcStablesRegistry,
  ContractGasFunderETHRegistry,
  ContractPmlStablesRegistry,
  ContractStethRewardProgramRegistry,
  ContractAllianceOpsStablesAllowedRecipientsRegistry,
} from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR, SWRResponse } from 'modules/network/hooks/useSwr'
import {
  getLimits,
  LimitsType,
  getPeriodData,
  PeriodDataType,
} from 'modules/motions/utils'
import { MotionType } from 'modules/motions/types'
import { EvmUnrecognized } from 'modules/motions/evmAddresses'

import { calcPeriodData } from './utils'
import { useConfig } from 'modules/config/hooks/useConfig'

type ContractLimitsMethods = {
  getLimitParameters: LimitCheckerAbi['getLimitParameters']
  getPeriodState: LimitCheckerAbi['getPeriodState']
  address: string
}

type UsePeriodLimitInfoProps<T> = {
  contract: T
  isPending?: boolean
}

export type UsePeriodLimitsInfoResultData = {
  limits: LimitsType
  periodData: PeriodDataType
  motionDuration: number
  isEndInNextPeriod: boolean
}

type UsePeriodLimitInfo = <T extends ContractLimitsMethods>(
  data: UsePeriodLimitInfoProps<T>,
) => SWRResponse<UsePeriodLimitsInfoResultData>

const getPeriodLimitsInfo = async <T extends ContractLimitsMethods>(
  easyTrack: EasyTrackAbi,
  contract: T,
  isPending?: boolean,
) => {
  let [motionDuration, limits, periodData] = await Promise.all([
    easyTrack.motionDuration(),
    getLimits(contract),
    getPeriodData(contract),
  ])

  return calcPeriodData({
    motionDuration,
    limits,
    periodData,
    isPending,
  })
}

export const usePeriodLimitsInfo: UsePeriodLimitInfo = props => {
  const { contract, isPending } = props
  const { chainId } = useWeb3()
  const { address } = contract

  const easyTrack = ContractEasyTrack.useRpc()

  return useSWR(
    `period-limits-${chainId}-${address}`,
    async () => {
      const data = await getPeriodLimitsInfo(easyTrack, contract, isPending)

      return data
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}

const isContractWithLimits = (
  contract: unknown,
): contract is ContractLimitsMethods => {
  if (typeof contract !== 'object' || contract === null) return false
  if ('getLimitParameters' in contract || 'getPeriodState' in contract)
    return true

  return false
}

const registryByMotionType: {
  [key in MotionType]?: ReturnType<typeof createContractHelpers>
} = {
  [MotionType.LegoLDOTopUp]: ContractLegoLDORegistry,
  [MotionType.LegoDAITopUp]: ContractLegoStablesRegistry,
  [MotionType.RccStablesTopUp]: ContractRccStablesRegistry,
  [MotionType.PmlStablesTopUp]: ContractPmlStablesRegistry,
  [MotionType.AtcStablesTopUp]: ContractAtcStablesRegistry,
  [MotionType.RccDAITopUp]: ContractRccStablesRegistry,
  [MotionType.PmlDAITopUp]: ContractPmlStablesRegistry,
  [MotionType.AtcDAITopUp]: ContractAtcStablesRegistry,
  [MotionType.GasFunderETHTopUp]: ContractGasFunderETHRegistry,
  [MotionType.AllowedRecipientTopUp]: ContractAllowedRecipientRegistry,
  [MotionType.AllowedRecipientTopUpReferralDai]:
    ContractAllowedRecipientReferralDaiRegistry,
  [MotionType.AllowedRecipientTopUpTrpLdo]:
    ContractAllowedRecipientTrpLdoRegistry,
  [MotionType.StethRewardProgramTopUp]: ContractStethRewardProgramRegistry,
  [MotionType.LegoStablesTopUp]: ContractLegoStablesRegistry,
  [MotionType.AllianceOpsStablesTopUp]:
    ContractAllianceOpsStablesAllowedRecipientsRegistry,
}

export const usePeriodLimitsInfoByMotionType = (props: {
  motionType: MotionType | EvmUnrecognized
  isPending?: boolean
}) => {
  const { motionType, isPending } = props
  const { chainId } = useWeb3()
  const swrKey = `${motionType}-period-limits-data`
  const easyTrack = ContractEasyTrack.useRpc()
  const { getRpcUrl } = useConfig()

  return useSWR(
    `${swrKey}-${chainId}-${motionType}`,
    async () => {
      if (motionType === EvmUnrecognized) return null

      const registry = registryByMotionType[motionType]?.connectRpc({
        chainId,
        rpcUrl: getRpcUrl(chainId),
        cacheSeed: `period-limits-${chainId}-${motionType}`,
      })

      if (!isContractWithLimits(registry)) return null

      const data = await getPeriodLimitsInfo(easyTrack, registry, isPending)

      return data
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}
