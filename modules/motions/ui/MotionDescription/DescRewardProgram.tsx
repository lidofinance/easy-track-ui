import { useMemo } from 'react'
import {
  useRewardProgramsAll,
  useRewardProgramsMapAll,
} from 'modules/motions/hooks/useRewardPrograms'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

import { formatEther } from 'ethers/lib/utils'
import {
  EvmAddRewardProgramAbi,
  EvmRemoveRewardProgramAbi,
  EvmTopUpRewardProgramsAbi,
} from 'generated'
import { NestProps } from './types'

// RewardProgramAdd
export function DescRewardProgramAdd({
  callData,
}: NestProps<EvmAddRewardProgramAbi['decodeEVMScriptCallData']>) {
  return (
    <div>
      Add reward program <b>“{callData[1]}”</b> with address{' '}
      <AddressInlineWithPop address={callData[0]} />
    </div>
  )
}

// RewardProgramTopUp
export function DescRewardProgramTopUp({
  callData,
}: NestProps<EvmTopUpRewardProgramsAbi['decodeEVMScriptCallData']>) {
  const governanceSymbol = useGovernanceSymbol()
  const { data: rewardProgramsMap } = useRewardProgramsMapAll()

  const programs = useMemo(() => {
    if (!rewardProgramsMap) return null
    return callData[0].map(address => rewardProgramsMap[address])
  }, [callData, rewardProgramsMap])

  return (
    <div>
      Top up reward programs:
      {callData[0].map((address, i) => (
        <div key={i}>
          <b>{programs?.[i]}</b> <AddressInlineWithPop address={address} /> with{' '}
          {formatEther(callData[1][i])} {governanceSymbol.data}
        </div>
      ))}
    </div>
  )
}

// RewardProgramRemove
export function DescRewardProgramRemove({
  callData,
}: NestProps<EvmRemoveRewardProgramAbi['decodeEVMScriptCallData']>) {
  const { data: rewardPrograms } = useRewardProgramsAll()

  const program = useMemo(() => {
    if (!rewardPrograms) return null
    return rewardPrograms.find(p => p.address === callData)
  }, [callData, rewardPrograms])

  return (
    <div>
      Remove reward program <b>{program?.title}</b> with address{' '}
      <AddressInlineWithPop address={callData} />
    </div>
  )
}
