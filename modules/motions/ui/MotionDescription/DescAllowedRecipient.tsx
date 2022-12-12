import { useMemo } from 'react'
import { useMapAll, useAll } from 'modules/motions/hooks'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { MotionType } from 'modules/motions/types'

import { formatEther } from 'ethers/lib/utils'
import {
  AddAllowedRecipientLDOAbi,
  RemoveAllowedRecipientLDOAbi,
  TopUpAllowedRecipientsLDOAbi,
} from 'generated'
import { NestProps } from './types'

export function DescAllowedRecipientAdd({
  callData,
}: NestProps<AddAllowedRecipientLDOAbi['decodeEVMScriptCallData']>) {
  return (
    <div>
      Add reward program <b>“{callData[1]}”</b> with address{' '}
      <AddressInlineWithPop address={callData[0]} />
    </div>
  )
}

export function DescAllowedRecipientTopUp({
  callData,
}: NestProps<TopUpAllowedRecipientsLDOAbi['decodeEVMScriptCallData']>) {
  const governanceSymbol = useGovernanceSymbol()
  const { data: allowedRecipientMap } = useMapAll({
    registryType: MotionType.AllowedRecipientTopUp,
  })

  const recipients = useMemo(() => {
    if (!allowedRecipientMap) return null
    return callData[0].map(address => allowedRecipientMap[address])
  }, [callData, allowedRecipientMap])

  return (
    <div>
      Top up reward programs:
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
  const { data: allowedRecipients } = useAll({
    registryType: MotionType.AllowedRecipientRemove,
  })

  const program = useMemo(() => {
    if (!allowedRecipients) return null
    return allowedRecipients.find(p => p.address === callData)
  }, [callData, allowedRecipients])

  return (
    <div>
      Remove reward program <b>{program?.title}</b> with address{' '}
      <AddressInlineWithPop address={callData} />
    </div>
  )
}
