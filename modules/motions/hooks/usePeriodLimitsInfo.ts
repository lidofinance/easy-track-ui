import moment from 'moment'
import { LimitCheckerAbi } from 'generated'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR, SWRResponse } from 'modules/network/hooks/useSwr'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import {
  getLimits,
  LimitsType,
  getPeriodData,
  PeriodDataType,
} from 'modules/motions/utils'

type UsePeriodLimitInfo = <
  T extends {
    getLimitParameters: LimitCheckerAbi['getLimitParameters']
    getPeriodState: LimitCheckerAbi['getPeriodState']
  },
>(data: {
  address: string
  contract: T
  swrKey: string
}) => SWRResponse<{
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
