import { useMemo } from 'react'
import {
  useAllowedRecipientAll,
  useAllowedRecipientMapAll,
} from 'modules/motions/hooks/useAllowedRecipient'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

import { formatEther } from 'ethers/lib/utils'
import {
  AddAllowedRecipientLDOAbi,
  RemoveAllowedRecipientLDOAbi,
  TopUpAllowedRecipientsDAIAbi,
} from 'generated'
import { NestProps } from './types'

export function DescAllowedRecipientAdd({
  callData,
}: NestProps<AddAllowedRecipientLDOAbi['decodeEVMScriptCallData']>) {
  return (
    <div>
      Add allowed recipient <b>“{callData[1]}”</b> with address{' '}
      <AddressInlineWithPop address={callData[0]} />
    </div>
  )
}

export function DescAllowedRecipientTopUp({
  callData,
}: NestProps<TopUpAllowedRecipientsDAIAbi['decodeEVMScriptCallData']>) {
  const governanceSymbol = useGovernanceSymbol()
  const { data: allowedRecipientMap } = useAllowedRecipientMapAll()

  const recipients = useMemo(() => {
    if (!allowedRecipientMap) return null
    return callData[0].map(address => allowedRecipientMap[address])
  }, [callData, allowedRecipientMap])

  return (
    <div>
      Top up allowed recipient:
      {callData[0].map((address, i) => (
        <div key={i}>
          <b>{recipients?.[i]}</b> <AddressInlineWithPop address={address} />{' '}
          with {formatEther(callData[1][i])} {governanceSymbol.data}
        </div>
      ))}
    </div>
  )
}

export function DescAllowedRecipientRemove({
  callData,
}: NestProps<RemoveAllowedRecipientLDOAbi['decodeEVMScriptCallData']>) {
  const { data: allowedRecipients } = useAllowedRecipientAll()

  const program = useMemo(() => {
    if (!allowedRecipients) return null
    return allowedRecipients.find(p => p.address === callData)
  }, [callData, allowedRecipients])

  return (
    <div>
      Remove allowed recipient <b>{program?.title}</b> with address{' '}
      <AddressInlineWithPop address={callData} />
    </div>
  )
}
