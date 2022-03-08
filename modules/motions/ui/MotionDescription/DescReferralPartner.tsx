import { useMemo } from 'react'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'
import {
  useReferralPartners,
  useReferralPartnersMap,
} from 'modules/motions/hooks/useReferralPartners'

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
  const { data: referralPartnersMap } = useReferralPartnersMap()

  const programs = useMemo(() => {
    if (!referralPartnersMap) return null
    return callData[0].map(address => referralPartnersMap[address])
  }, [callData, referralPartnersMap])

  return (
    <div>
      Top up referral partner:
      {callData[0].map((address, i) => (
        <div key={i}>
          <b>{programs?.[i]}</b> <AddressInlineWithPop address={address} /> with{' '}
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
  const { data: referralPartners } = useReferralPartners()

  const partner = useMemo(() => {
    if (!referralPartners) return null
    return referralPartners.find(p => p.address === callData)
  }, [callData, referralPartners])

  return (
    <div>
      Remove referral partner with address <b>{partner}</b>{' '}
      <AddressInlineWithPop address={callData} />
    </div>
  )
}
