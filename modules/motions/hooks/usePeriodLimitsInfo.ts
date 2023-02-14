import moment from 'moment'
import { LimitCheckerAbi, EasyTrackAbi } from 'generated'
import { createContractHelpers } from 'modules/blockChain/utils/createContractHelpers'
import {
  ContractLegoDAIRegistry,
  ContractEasyTrack,
  ContractAllowedRecipientRegistry,
  ContractAllowedRecipientReferralDaiRegistry,
  ContractLegoLDORegistry,
  ContractRccDAIRegistry,
  ContractAtcDAIRegistry,
  ContractGasFunderETHRegistry,
  ContractPmlDAIRegistry,
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

const getNewPeriod = ({
  periodLimit,
  periodDurationMonths,
  newPeriodStartTime,
}: {
  periodLimit: string
  periodDurationMonths: number
  newPeriodStartTime: moment.Moment
}): PeriodDataType => {
  return {
    alreadySpentAmount: '0',
    periodStartTimestamp: newPeriodStartTime.unix(),
    periodEndTimestamp: newPeriodStartTime
      .add(periodDurationMonths, 'M')
      .startOf('month')
      .unix(),
    spendableBalanceInPeriod: periodLimit,
  }
}

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

  const dateOfStartMotion = moment.unix(periodData.periodStartTimestamp)
  const isStartInPrevPeriod = moment()
    .startOf('month')
    .isAfter(dateOfStartMotion)

  const dateOfEndMotion = moment().add(motionDuration.toNumber(), 'seconds')
  const periodEnd = isStartInPrevPeriod
    ? moment()
        .startOf('month')
        .add(limits.periodDurationMonths, 'M')
        .startOf('month')
    : moment.unix(periodData.periodEndTimestamp)

  const isEndInNextPeriod = dateOfEndMotion.isAfter(periodEnd)

  if (isEndInNextPeriod && !isPending) {
    periodData = getNewPeriod({
      periodLimit: limits.limit,
      periodDurationMonths: limits.periodDurationMonths,
      newPeriodStartTime: moment()
        .add(limits.periodDurationMonths, 'M')
        .startOf('month'),
    })
  }

  if (isStartInPrevPeriod) {
    periodData = getNewPeriod({
      periodLimit: limits.limit,
      periodDurationMonths: limits.periodDurationMonths,
      newPeriodStartTime: moment().startOf('month'),
    })
  }

  return {
    limits,
    periodData,
    motionDuration: motionDuration.toNumber() / 60 / 60, // hours
    isEndInNextPeriod,
  }
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
  [MotionType.LegoDAITopUp]: ContractLegoDAIRegistry,
  [MotionType.RccDAITopUp]: ContractRccDAIRegistry,
  [MotionType.PmlDAITopUp]: ContractPmlDAIRegistry,
  [MotionType.AtcDAITopUp]: ContractAtcDAIRegistry,
  [MotionType.GasFunderETHTopUp]: ContractGasFunderETHRegistry,
  [MotionType.AllowedRecipientTopUp]: ContractAllowedRecipientRegistry,
  [MotionType.AllowedRecipientTopUpReferralDai]:
    ContractAllowedRecipientReferralDaiRegistry,
}

export const usePeriodLimitsInfoByMotionType = (props: {
  motionType: MotionType | EvmUnrecognized
  isPending?: boolean
}) => {
  const { motionType, isPending } = props
  const { chainId } = useWeb3()
  const swrKey = `${motionType}-period-limits-data`
  const easyTrack = ContractEasyTrack.useRpc()

  return useSWR(
    `${swrKey}-${chainId}-${motionType}`,
    async () => {
      if (motionType === EvmUnrecognized) return null

      const registry = registryByMotionType[motionType]?.connectRpc({ chainId })

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
