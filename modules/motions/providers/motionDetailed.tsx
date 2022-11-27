import { FC, createContext, useMemo } from 'react'
import { formatEther } from 'ethers/lib/utils'

import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  getMotionTypeByScriptFactory,
  getMotionTypeDisplayName,
} from 'modules/motions/utils'
import {
  useMotionProgress,
  usePeriodLimitsInfoByMotionType,
  useMotionCreatedEvent,
  useContractEvmScript,
  usePeriodLimitsInfoResultData,
  useMotionTimeCountdown,
  MotionTimeData,
} from 'modules/motions/hooks'
import { EvmUnrecognized } from 'modules/motions/evmAddresses'
import { Motion, MotionStatus } from 'modules/motions/types'

export type MotionDetailedValue = {
  isArchived: boolean
  isOverPeriodLimit: boolean
  pending: boolean
  periodLimitsData?: usePeriodLimitsInfoResultData | null
  progress: {
    thresholdPct: number
    thresholdAmount: number
    objectionsPct: number
    objectionsAmount: number
    objectionsPctFormatted: string | number
  } | null
  motionTopUpAmount: number
  motionTopUpToken: string
  timeData: MotionTimeData
  motionDisplaydName: string
}

export const MotionDetailedContext = createContext({} as MotionDetailedValue)

type MotionDetailedProps = {
  motion: Motion
}

export const MotionDetailedProvider: FC<MotionDetailedProps> = props => {
  const { children, motion } = props
  const { chainId } = useWeb3()

  const motionType = getMotionTypeByScriptFactory(
    chainId,
    motion.evmScriptFactory,
  )
  const motionDisplaydName = getMotionTypeDisplayName(motionType)

  const contract = useContractEvmScript(motionType)
  const progress = useMotionProgress(motion)
  const timeData = useMotionTimeCountdown(motion)

  const { data: periodLimitsData, initialLoading: isPeriodLimitsDataLoading } =
    usePeriodLimitsInfoByMotionType({
      motionType,
    })
  const { data: createdEvent, initialLoading: isEventLoading } =
    useMotionCreatedEvent(motion.id)
  const callDataRaw = createdEvent?._evmScriptCallData

  const { data: callData, initialLoading: isCallDataLoading } = useSWR(
    isEventLoading ? null : `call-data-${chainId}-${motion.id}`,
    () => {
      if (motionType === EvmUnrecognized || !contract || !callDataRaw) {
        return null
      }
      return contract.decodeEVMScriptCallData(callDataRaw) as any
    },
  )

  const isArchived =
    motion.status !== MotionStatus.ACTIVE &&
    motion.status !== MotionStatus.PENDING
  const motionTopUpAmount =
    (callData?.[1]?.[0] && Number(formatEther(callData[1][0]))) || 0 // TODO: refactor
  const motionTopUpToken = ''
  const pending =
    isCallDataLoading || isEventLoading || isPeriodLimitsDataLoading

  const newSpentAmount =
    Number(periodLimitsData?.periodData.alreadySpentAmount) +
    Number(motionTopUpAmount)
  const isOverPeriodLimit =
    newSpentAmount > Number(periodLimitsData?.limits.limit)

  const value = useMemo(
    () => ({
      isArchived,
      pending,
      isOverPeriodLimit,
      timeData,
      motionTopUpAmount,
      motionTopUpToken,
      periodLimitsData,
      progress,
      motionDisplaydName,
    }),
    [
      isArchived,
      isOverPeriodLimit,
      motionTopUpAmount,
      motionTopUpToken,
      pending,
      periodLimitsData,
      progress,
      timeData,
      motionDisplaydName,
    ],
  )

  return (
    <MotionDetailedContext.Provider value={value}>
      {children}
    </MotionDetailedContext.Provider>
  )
}
