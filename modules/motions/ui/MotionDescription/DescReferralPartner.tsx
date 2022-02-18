import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

import { formatEther } from 'ethers/lib/utils'
import {
  EvmAddReferralPartnerAbi,
  EvmRemoveReferralPartnerAbi,
  EvmTopUpReferralPartnersAbi,
} from 'generated'
import { NestProps } from './types'

// ReferralPartnerAdd
export function DescReferralPartnerAdd({
  callData,
}: NestProps<EvmAddReferralPartnerAbi['decodeEVMScriptCallData']>) {
  return (
    <div>
      Add referral partner <b>“{callData[1]}”</b> with address{' '}
      <AddressInlineWithPop address={callData[0]} />
    </div>
  )
}

// ReferralPartnerTopUp
export function DescReferralPartnerTopUp({
  callData,
}: NestProps<EvmTopUpReferralPartnersAbi['decodeEVMScriptCallData']>) {
  const governanceSymbol = useGovernanceSymbol()
  return (
    <div>
      Top up referral partner:
      {callData[0].map((address, i) => (
        <div key={i}>
          <AddressInlineWithPop address={address} /> with{' '}
          {formatEther(callData[1][i])} {governanceSymbol.data}
        </div>
      ))}
    </div>
  )
}

// ReferralPartnerRemove
export function DescReferralPartnerRemove({
  callData,
}: NestProps<EvmRemoveReferralPartnerAbi['decodeEVMScriptCallData']>) {
  return (
    <div>
      Remove referral partner with address{' '}
      <AddressInlineWithPop address={callData} />
    </div>
  )
}
