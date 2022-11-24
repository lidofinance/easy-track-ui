import moment from 'moment'
import { LimitCheckerAbi } from 'generated'
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

type UsePeriodLimitInfo = <T extends ContractLimitsMethods>(
  data: UsePeriodLimitInfoProps<T>,
) => SWRResponse<{
  limits: LimitsType
  periodData: PeriodDataType
  motionDuration: number
  isEndInNextPeriod: boolean
}>

export const usePeriodLimitsInfo: UsePeriodLimitInfo = props => {
  const { address, contract, swrKey } = props
  const { chainId } = useWeb3()

  const easyTrack = ContractEasyTrack.useRpc()

  return useSWR(
    `${swrKey}-${chainId}-${address}`,
    async () => {
      const motionDuration = await easyTrack.motionDuration()
      const limits = await getLimits(contract)
      const periodData = await getPeriodData(contract)

      const dateOfEndMotion = moment().add(motionDuration.toNumber(), 'seconds')
      const now = moment.unix(periodData.periodEndTimestamp)

      const isEndInNextPeriod = dateOfEndMotion.isAfter(now)

      return {
        limits,
        periodData,
        motionDuration: motionDuration.toNumber() / 60 / 60, // hours
        isEndInNextPeriod,
      }
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

      const motionDuration = await easyTrack.motionDuration()
      const limits = await getLimits(registry)
      const periodData = await getPeriodData(registry)

      const dateOfEndMotion = moment().add(motionDuration.toNumber(), 'seconds')
      const now = moment.unix(periodData.periodEndTimestamp)

      const isEndInNextPeriod = dateOfEndMotion.isAfter(now)

      return {
        limits,
        periodData,
        motionDuration: motionDuration.toNumber() / 60 / 60, // hours
        isEndInNextPeriod,
      }
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}
