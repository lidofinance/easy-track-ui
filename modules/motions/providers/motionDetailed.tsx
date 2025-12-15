import { FC, createContext, useMemo, useCallback } from 'react'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import invariant from 'tiny-invariant'

import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  getMotionTypeByScriptFactory,
  getMotionTypeDisplayName,
  estimateGasFallback,
} from 'modules/motions/utils'
import {
  useMotionProgress,
  usePeriodLimitsInfoByMotionType,
  useContractEvmScript,
  UsePeriodLimitsInfoResultData,
  useMotionTimeCountdown,
  MotionTimeData,
  useTokenByTopUpType,
} from 'modules/motions/hooks'
import { useTransactionSender } from 'modules/blockChain/hooks/useTransactionSender'
import { EvmUnrecognized } from 'modules/motions/evmAddresses'
import { Motion, MotionStatus } from 'modules/motions/types'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { useMotionTokenData } from '../hooks/useMotionTokenData'
import { BigNumber, utils } from 'ethers'
import { DEFAULT_DECIMALS } from 'modules/blockChain/constants'
import { useAvailableStonks } from 'modules/stonks/hooks/useAvailableStonks'

const getTopUpAmount = (callData: any, tokenDecimals = DEFAULT_DECIMALS) => {
  if (!callData) {
    return 0
  }

  if (callData[1]?.[0]?._isBigNumber) {
    return Number(formatEther(callData[1][0])) || 0
  }

  if (Array.isArray(callData.amounts)) {
    const amountsSum = (callData.amounts as BigNumber[]).reduce((acc, amount) =>
      acc.add(amount),
    )

    return Number(formatUnits(amountsSum, tokenDecimals))
  }

  return 0
}

export type MotionDetailedValue = {
  isArchived: boolean
  isOverPeriodLimit: boolean
  isCanEnactInNextPeriod?: boolean
  pending: boolean
  periodLimitsData?: UsePeriodLimitsInfoResultData | null
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
  txObject: ReturnType<typeof useTransactionSender>
  txEnact: ReturnType<typeof useTransactionSender>
  stonksRecipientAddress: string | undefined
}

export const MotionDetailedContext = createContext({} as MotionDetailedValue)

type MotionDetailedProps = {
  motion: Motion
  onInvalidate?: () => void
}

export const MotionDetailedProvider: FC<MotionDetailedProps> = props => {
  const { children, motion, onInvalidate } = props
  const { chainId } = useWeb3()

  const motionType = getMotionTypeByScriptFactory(
    chainId,
    motion.evmScriptFactory,
  )
  const motionDisplaydName = getMotionTypeDisplayName(motionType)

  const contract = useContractEvmScript(motionType)
  const progress = useMotionProgress(motion)
  const timeData = useMotionTimeCountdown(motion)
  const topUpToken = useTokenByTopUpType({ registryType: motionType })

  const isPending = motion.status === MotionStatus.PENDING
  const { data: periodLimitsData, initialLoading: isPeriodLimitsDataLoading } =
    usePeriodLimitsInfoByMotionType({
      motionType,
      isPending,
    })
  const callDataRaw = motion.evmScriptCalldata

  const { data: callData, initialLoading: isCallDataLoading } = useSWR(
    `call-data-${chainId}-${motion.id}`,
    () => {
      if (motionType === EvmUnrecognized || !contract || !callDataRaw) {
        return null
      }
      return contract.decodeEVMScriptCallData(callDataRaw) as any
    },
  )

  const { availableStonks } = useAvailableStonks()

  const stonksRecipientAddress = useMemo(() => {
    if (!callData || !availableStonks?.length) {
      return
    }

    const stonksSet = new Set(availableStonks.map(stonks => stonks.address))

    if (Array.isArray(callData['recipients'])) {
      return callData['recipients'].find((recipient: string) =>
        stonksSet.has(utils.getAddress(recipient)),
      ) as string | undefined
    }

    if (
      typeof callData['recipient'] === 'string' &&
      utils.isAddress(callData['recipient'])
    ) {
      const recipientAddress = utils.getAddress(callData['recipient'])
      if (stonksSet.has(recipientAddress)) {
        return recipientAddress
      }
    }
  }, [availableStonks, callData])

  const { tokenData } = useMotionTokenData(
    callData?.token ?? topUpToken.address,
  )

  const isArchived =
    motion.status !== MotionStatus.ACTIVE &&
    motion.status !== MotionStatus.PENDING

  const motionTopUpAmount = getTopUpAmount(
    callData,
    tokenData?.decimals ?? DEFAULT_DECIMALS,
  )
  const motionTopUpToken = tokenData?.label ?? ''
  const pending = isCallDataLoading || isPeriodLimitsDataLoading

  const newSpentAmount =
    Number(periodLimitsData?.periodData.alreadySpentAmount) + motionTopUpAmount
  const isOverPeriodLimit =
    newSpentAmount > Number(periodLimitsData?.limits.limit)
  const isCanEnactInNextPeriod =
    motionTopUpAmount <= Number(periodLimitsData?.limits.limit)

  const contractEasyTrack = ContractEasyTrack.useWeb3()

  // Submit Objection
  const populateObject = useCallback(async () => {
    const gasLimit = await estimateGasFallback(
      contractEasyTrack.estimateGas.objectToMotion(motion.id),
    )
    const tx = await contractEasyTrack.populateTransaction.objectToMotion(
      motion.id,
      { gasLimit },
    )
    return tx
  }, [contractEasyTrack, motion.id])

  const txObject = useTransactionSender(populateObject, {
    onFinish: onInvalidate,
  })

  // Enact Motion
  const populateEnact = useCallback(async () => {
    invariant(callDataRaw, 'enact action: call data must be presented')
    const gasLimit = await estimateGasFallback(
      contractEasyTrack.estimateGas.enactMotion(motion.id, callDataRaw),
    )
    const tx = await contractEasyTrack.populateTransaction.enactMotion(
      motion.id,
      callDataRaw,
      {
        gasLimit,
      },
    )
    return tx
  }, [contractEasyTrack, motion.id, callDataRaw])

  const txEnact = useTransactionSender(populateEnact, {
    onFinish: onInvalidate,
  })

  const value = useMemo(
    () => ({
      isArchived,
      pending,
      isOverPeriodLimit,
      isCanEnactInNextPeriod,
      timeData,
      motionTopUpAmount,
      motionTopUpToken,
      periodLimitsData,
      progress,
      motionDisplaydName,
      txObject,
      txEnact,
      stonksRecipientAddress,
    }),
    [
      isArchived,
      pending,
      isOverPeriodLimit,
      isCanEnactInNextPeriod,
      timeData,
      motionTopUpAmount,
      motionTopUpToken,
      periodLimitsData,
      progress,
      motionDisplaydName,
      txObject,
      txEnact,
      stonksRecipientAddress,
    ],
  )

  return (
    <MotionDetailedContext.Provider value={value}>
      {children}
    </MotionDetailedContext.Provider>
  )
}
