import { utils } from 'ethers'

import { useMemo } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useMotionCreatedEvent } from 'modules/motions/hooks/useMotionCreatedEvent'
import { useLegoTokenOptions } from 'modules/motions/hooks/useLegoTokenOptions'
import {
  useContractEvmScript,
  // useContractEvmNodeOperatorIncreaseLimit,
  // useContractEvmLEGOTopUp,
  // useContractEvmRewardProgramAdd,
  // useContractEvmRewardProgramRemove,
  // useContractEvmRewardProgramTopUp,
} from 'modules/motions/hooks/useContractEvmScript'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

import { formatEther } from 'ethers/lib/utils'
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
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

type NestProps<C extends (...a: any) => Promise<any>> = {
  callData: UnpackedPromise<ReturnType<C>>
}

// NodeOperatorIncreaseLimit
function DescNodeOperatorIncreaseLimit({
  callData,
}: NestProps<
  EvmIncreaseNodeOperatorStakingLimitAbi['decodeEVMScriptCallData']
>) {
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
  const options = useLegoTokenOptions()
  const formattedTokens = useMemo(() => {
    return callData[0].map(
      address =>
        options.find(
          o => utils.getAddress(o.value) === utils.getAddress(address),
        )?.label,
    )
  }, [callData, options])
  return (
    <div>
      Top up LEGO program with:
      {callData[0].map((_, i) => (
        <div key={i}>
          {formatEther(callData[1][i])}{' '}
          {formattedTokens[i] || (
            <>
              token with address{' '}
              <AddressInlineWithPop address={callData[0][i]} />
            </>
          )}
        </div>
      ))}
    </div>
  )
}

// RewardProgramAdd
function DescRewardProgramAdd({
  callData,
}: NestProps<EvmAddRewardProgramAbi['decodeEVMScriptCallData']>) {
  return (
    <div>
      Add reward program “{callData[1]}” with address{' '}
      <AddressInlineWithPop address={callData[0]} />
    </div>
  )
}

// RewardProgramTopUp
function DescRewardProgramTopUp({
  callData,
}: NestProps<EvmTopUpRewardProgramsAbi['decodeEVMScriptCallData']>) {
  const governanceSymbol = useGovernanceSymbol()
  return (
    <div>
      Top up reward programs:
      {callData[0].map((address, i) => (
        <div key={i}>
          <AddressInlineWithPop address={address} /> with{' '}
          {formatEther(callData[1][i])} {governanceSymbol.data}
        </div>
      ))}
    </div>
  )
}

// RewardProgramRemove
function DescRewardProgramRemove({
  callData,
}: NestProps<EvmRemoveRewardProgramAbi['decodeEVMScriptCallData']>) {
  return (
    <div>
      Remove reward program with address{' '}
      <AddressInlineWithPop address={callData} />
    </div>
  )
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
  const motionType = getMotionTypeByScriptFactory(
    chainId,
    motion.evmScriptFactory,
  )
  const contract = useContractEvmScript(motionType)
  const { initialLoading: isLoadingEvent, data: createdEvent } =
    useMotionCreatedEvent(motion.id)
  const callDataRaw = createdEvent?._evmScriptCallData

  const { data: callData } = useSWR(
    isLoadingEvent ? null : `call-data-${chainId}-${motion.id}`,
    () => {
      if (motionType === EvmUnrecognized || !contract || !callDataRaw) {
        return null
      }
      return contract.decodeEVMScriptCallData(callDataRaw) as any
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
