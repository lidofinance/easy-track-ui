import { useMemo } from 'react'
import { useSWR } from 'modules/shared/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useMotionCallData } from 'modules/motions/hooks/useMotionCallData'
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

type CallDataTypeByEvm = {
  [MotionType.NodeOperatorIncreaseLimit]: UnpackedPromise<
    ReturnType<EvmIncreaseNodeOperatorStakingLimitAbi['_decodeMotionData']>
  >
  [MotionType.LEGOTopUp]: UnpackedPromise<
    ReturnType<EvmTopUpLegoProgramAbi['decodeEVMScriptCallData']>
  >
  [MotionType.RewardProgramAdd]: UnpackedPromise<
    ReturnType<EvmAddRewardProgramAbi['decodeEVMScriptCallData']>
  >
  [MotionType.RewardProgramTopUp]: UnpackedPromise<
    ReturnType<EvmRemoveRewardProgramAbi['decodeEVMScriptCallData']>
  >
  [MotionType.RewardProgramRemove]: UnpackedPromise<
    ReturnType<EvmTopUpRewardProgramsAbi['decodeEVMScriptCallData']>
  >
}

type NestProps<T extends MotionType> = {
  callData: CallDataTypeByEvm[T]
}

// NodeOperatorIncreaseLimit
function DescriptionNodeOperatorIncreaseLimit(
  props: NestProps<'NodeOperatorIncreaseLimit'>,
) {
  const { callData } = props
  return (
    <div>
      Node operator with id {Number(callData._nodeOperatorId)} wants to increase
      staking limit to {Number(callData._stakingLimit)}
    </div>
  )
}

// LEGOTopUp
function DescriptionLEGOTopUp(props: NestProps<'LEGOTopUp'>) {
  const { callData } = props
  return <div>DescriptionLEGOTopUp {JSON.stringify(callData)}</div>
}

// RewardProgramAdd
function DescriptionRewardProgramAdd(props: NestProps<'RewardProgramAdd'>) {
  const { callData } = props
  return <div>DescriptionRewardProgramAdd {JSON.stringify(callData)}</div>
}

// RewardProgramTopUp
function DescriptionRewardProgramTopUp(props: NestProps<'RewardProgramTopUp'>) {
  const { callData } = props
  return <div>DescriptionRewardProgramTopUp {JSON.stringify(callData)}</div>
}

// RewardProgramRemove
function DescriptionRewardProgramRemove(
  props: NestProps<'RewardProgramRemove'>,
) {
  const { callData } = props
  return <div>DescriptionRewardProgramRemove {JSON.stringify(callData)}</div>
}

const MOTION_DESCRIPTIONS = {
  [MotionType.NodeOperatorIncreaseLimit]: DescriptionNodeOperatorIncreaseLimit,
  [MotionType.LEGOTopUp]: DescriptionLEGOTopUp,
  [MotionType.RewardProgramAdd]: DescriptionRewardProgramAdd,
  [MotionType.RewardProgramTopUp]: DescriptionRewardProgramTopUp,
  [MotionType.RewardProgramRemove]: DescriptionRewardProgramRemove,
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
  const { initialLoading, data: callDataRaw } = useMotionCallData(motion.id)
  const { data: callData } = useSWR(
    initialLoading ? null : `call-data-${chainId}-${motion.id}`,
    () => {
      if (motionType === EvmUnrecognized) return null
      return (contract as any)[CALL_DATA_DECODERS[motionType]](callDataRaw)
    },
  )

  if (motionType === EvmUnrecognized) {
    return <>Unrecognized motion type</>
  }

  if (initialLoading || !callData) {
    return <>Loading...</>
  }

  const Desc = MOTION_DESCRIPTIONS[motionType]

  return <Desc callData={callData} />
}
