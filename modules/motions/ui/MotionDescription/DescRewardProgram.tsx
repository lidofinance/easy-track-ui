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
/**
 * @deprecated
 */
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
/**
 * @deprecated
 */
export function DescRewardProgramTopUp({
  callData,
}: NestProps<EvmTopUpRewardProgramsAbi['decodeEVMScriptCallData']>) {
  const governanceSymbol = useGovernanceSymbol()

  return (
    <div>
      Top up reward programs:
      {callData[0].map((address, i) => (
        <div key={i}>
          <AddressInlineWithPop address={address} /> with{' '}
          {Number(formatEther(callData[1][i])).toLocaleString('en-EN')}{' '}
          {governanceSymbol.data}
        </div>
      ))}
    </div>
  )
}

// RewardProgramRemove
/**
 * @deprecated
 */
export function DescRewardProgramRemove({
  callData,
}: NestProps<EvmRemoveRewardProgramAbi['decodeEVMScriptCallData']>) {
  return (
    <div>
      Remove reward program with address{' '}
      <AddressInlineWithPop address={callData} />
    </div>
  )
}
