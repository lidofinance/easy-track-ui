import { formatEther } from 'ethers/lib/utils'
import { Divider } from '@lidofinance/lido-ui'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'
import { MotionLimitProgress } from 'modules/motions/ui/MotionLimitProgress'
import { usePeriodLimitsInfoByMotionType } from 'modules/motions/hooks/usePeriodLimitsInfo'
import { useContractEvmScript } from 'modules/motions/hooks/useContractEvmScript'
import { useMotionCreatedEvent } from 'modules/motions/hooks/useMotionCreatedEvent'
import { EvmUnrecognized } from 'modules/motions/evmAddresses'
import { Motion, MotionType } from 'modules/motions/types'

import { MotionDetailedLimitsWrapper } from './MotionDetailedLimitsStyle'

type MotionDetailedTimeProps = {
  motionType: MotionType | EvmUnrecognized
  motion: Motion
}

export function MotionDetailedLimits(props: MotionDetailedTimeProps) {
  const { motionType, motion } = props
  const { chainId } = useWeb3()
  const contract = useContractEvmScript(motionType)
  const { initialLoading: isLoadingEvent, data: createdEvent } =
    useMotionCreatedEvent(motion.id)
  const callDataRaw = createdEvent?._evmScriptCallData

  const { data: periodLimitsData } = usePeriodLimitsInfoByMotionType({
    motionType,
  })

  const { data: callData } = useSWR(
    isLoadingEvent ? null : `call-data-${chainId}-${motion.id}`,
    () => {
      if (motionType === EvmUnrecognized || !contract || !callDataRaw) {
        return null
      }
      return contract.decodeEVMScriptCallData(callDataRaw) as any
    },
  )

  if (!periodLimitsData) return null

  const amount = Number(formatEther(callData[1][0]))

  return (
    <>
      <Divider indents="md" />

      <MotionDetailedLimitsWrapper>
        <MotionLimitProgress
          spentAmount={periodLimitsData.periodData.alreadySpentAmount}
          totalLimit={periodLimitsData.limits.limit}
          startDate={periodLimitsData.periodData.periodStartTimestamp}
          endDate={periodLimitsData.periodData.periodEndTimestamp}
          token={''}
          newAmount={amount}
        />
      </MotionDetailedLimitsWrapper>
    </>
  )
}
