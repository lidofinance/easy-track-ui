import moment from 'moment'
import { LimitCheckerAbi, EasyTrackAbi } from 'generated'
import { createContractHelpers } from 'modules/blockChain/utils/createContractHelpers'
import {
  ContractSingleAllowedRecipientRegistry,
  ContractEasyTrack,
  ContractAllowedRecipientRegistry,
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
}

type UsePeriodLimitInfoProps<T> = {
  address: string
  contract: T
  swrKey: string
}

export type usePeriodLimitsInfoResultData = {
  limits: LimitsType
  periodData: PeriodDataType
  motionDuration: number
  isEndInNextPeriod: boolean
}

type UsePeriodLimitInfo = <T extends ContractLimitsMethods>(
  data: UsePeriodLimitInfoProps<T>,
) => SWRResponse<{
  limits: LimitsType
  periodData: PeriodDataType
  motionDuration: number
  isEndInNextPeriod: boolean
}>

const getNextPeriod = ({
  periodLimit,
  periodEndTimestamp,
  periodDurationMonths,
}: {
  periodLimit: string
  periodEndTimestamp: number
  periodDurationMonths: number
}) => {
  return {
    alreadySpentAmount: '0',
    periodStartTimestamp: moment().add(1, 'M').startOf('month').unix(),
    periodEndTimestamp: moment
      .unix(periodEndTimestamp)
      .add(periodDurationMonths, 'M')
      .startOf('month')
      .unix(),
    spendableBalanceInPeriod: periodLimit,
  }
}

const getPeriodLimitsInfo = async <T extends ContractLimitsMethods>(
  easyTrack: EasyTrackAbi,
  contract: T,
) => {
  const motionDuration = await easyTrack.motionDuration()
  const limits = await getLimits(contract)
  let periodData = await getPeriodData(contract)

  const dateOfEndMotion = moment().add(motionDuration.toNumber(), 'seconds')
  const now = moment.unix(periodData.periodEndTimestamp)

  const isEndInNextPeriod = dateOfEndMotion.isAfter(now)

  if (isEndInNextPeriod) {
    periodData = getNextPeriod({
      periodLimit: limits.limit,
      periodEndTimestamp: periodData.periodEndTimestamp,
      periodDurationMonths: limits.periodDurationMonths,
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
  const { address, contract, swrKey } = props
  const { chainId } = useWeb3()

  const easyTrack = ContractEasyTrack.useRpc()

  return useSWR(
    `${swrKey}-${chainId}-${address}`,
    async () => {
      const data = await getPeriodLimitsInfo(easyTrack, contract)

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
  [MotionType.SingleAllowedRecipientTopUp]:
    ContractSingleAllowedRecipientRegistry,
  [MotionType.AllowedRecipientTopUp]: ContractAllowedRecipientRegistry,
}

export const usePeriodLimitsInfoByMotionType = (props: {
  motionType: MotionType | EvmUnrecognized
}) => {
  const { motionType } = props
  const { chainId } = useWeb3()
  const swrKey = `${motionType}-period-limits-data`
  const easyTrack = ContractEasyTrack.useRpc()

  return useSWR(
    `${swrKey}-${chainId}-${motionType}`,
    async () => {
      if (motionType === EvmUnrecognized) return null

      const registry = registryByMotionType[motionType]?.connectRpc({ chainId })

      if (!isContractWithLimits(registry)) return null

      const data = await getPeriodLimitsInfo(easyTrack, registry)

      return data
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}
