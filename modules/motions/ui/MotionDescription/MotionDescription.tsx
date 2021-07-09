import { useMemo } from 'react'
import { useSWR } from 'modules/shared/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useMotionCreatedEvent } from 'modules/motions/hooks/useMotionCreatedEvent'
import {
  useContractEvmScript,
  // useContractEvmNodeOperatorIncreaseLimit,
  // useContractEvmLEGOTopUp,
  // useContractEvmRewardProgramAdd,
  // useContractEvmRewardProgramRemove,
  // useContractEvmRewardProgramTopUp,
} from 'modules/motions/hooks/useContractEvmScript'

// import { formatEther } from 'ethers/lib/utils'
import { Motion, MotionType } from 'modules/motions/types'
import { EvmUnrecognized } from 'modules/motions/evmAddresses'
import { UnpackedPromise } from 'modules/shared/utils/utilTypes'
import { getMotionTypeByScriptFactory } from 'modules/motions/utils/getMotionType'

import {
  EvmIncreaseNodeOperatorStakingLimitAbi,
  EvmTopUpLegoProgramAbi,
  EvmAddRewardProgramAbi,
  EvmRemoveRewardProgramAbi,
  EvmTopUpRewardProgramsAbi,
} from 'generated'

const CALL_DATA_DECODERS = {
  [MotionType.NodeOperatorIncreaseLimit]: '_decodeMotionData',
  [MotionType.LEGOTopUp]: 'decodeEVMScriptCallData',
  [MotionType.RewardProgramAdd]: 'decodeEVMScriptCallData',
  [MotionType.RewardProgramTopUp]: 'decodeEVMScriptCallData',
  [MotionType.RewardProgramRemove]: 'decodeEVMScriptCallData',
} as const

type NestProps<C extends (...a: any) => Promise<any>> = {
  callData: UnpackedPromise<ReturnType<C>>
}

// NodeOperatorIncreaseLimit
function DescNodeOperatorIncreaseLimit({
  callData,
}: NestProps<EvmIncreaseNodeOperatorStakingLimitAbi['_decodeMotionData']>) {
  return (
    <div>
      Node operator with id {Number(callData._nodeOperatorId)} wants to increase
      staking limit to {Number(callData._stakingLimit)}
    </div>
  )
}

// LEGOTopUp
function DescLEGOTopUp({
  callData,
}: NestProps<EvmTopUpLegoProgramAbi['decodeEVMScriptCallData']>) {
  return <div>DescriptionLEGOTopUp {JSON.stringify(callData)}</div>
}

// RewardProgramAdd
function DescRewardProgramAdd({
  callData,
}: NestProps<EvmAddRewardProgramAbi['decodeEVMScriptCallData']>) {
  return <div>DescriptionRewardProgramAdd {JSON.stringify(callData)}</div>
}

// RewardProgramTopUp
function DescRewardProgramTopUp({
  callData,
}: NestProps<EvmRemoveRewardProgramAbi['decodeEVMScriptCallData']>) {
  return <div>DescriptionRewardProgramTopUp {JSON.stringify(callData)}</div>
}

// RewardProgramRemove
function DescRewardProgramRemove({
  callData,
}: NestProps<EvmTopUpRewardProgramsAbi['decodeEVMScriptCallData']>) {
  return <div>DescriptionRewardProgramRemove {JSON.stringify(callData)}</div>
}

const MOTION_DESCRIPTIONS = {
  [MotionType.NodeOperatorIncreaseLimit]: DescNodeOperatorIncreaseLimit,
  [MotionType.LEGOTopUp]: DescLEGOTopUp,
  [MotionType.RewardProgramAdd]: DescRewardProgramAdd,
  [MotionType.RewardProgramTopUp]: DescRewardProgramTopUp,
  [MotionType.RewardProgramRemove]: DescRewardProgramRemove,
} as const

type Props = {
  motion: Motion
}

export function MotionDescription({ motion }: Props) {
  const chainId = useCurrentChain()
  const motionType = useMemo(
    () => getMotionTypeByScriptFactory(chainId, motion.evmScriptFactory),
    [chainId, motion.evmScriptFactory],
  )
  const contract = useContractEvmScript(motionType)
  const { initialLoading: isLoadingEvent, data: motionEvent } =
    useMotionCreatedEvent(motion.id)
  const callDataRaw = motionEvent?._evmScriptCallData

  const { data: callData } = useSWR(
    isLoadingEvent ? null : `call-data-${chainId}-${motion.id}`,
    () => {
      if (motionType === EvmUnrecognized) return null
      return (contract as any)[CALL_DATA_DECODERS[motionType]](callDataRaw)
    },
  )

  if (motionType === EvmUnrecognized) {
    return <>Unrecognized motion type</>
  }

  if (isLoadingEvent || !callData) {
    return <>Loading...</>
  }

  const Desc = MOTION_DESCRIPTIONS[motionType]

  return <Desc callData={callData} />
}
