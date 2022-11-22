import { useMemo } from 'react'
import { useSingleAllowedRecipientMapAll } from 'modules/motions/hooks/useSingleAllowedRecipient'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

import { formatEther } from 'ethers/lib/utils'
import { TopUpAllowedRecipientsDAIAbi } from 'generated'
import { NestProps } from './types'

const TOKEN = 'DAI'

export function DescSingleAllowedRecipientTopUp({
  callData,
}: NestProps<TopUpAllowedRecipientsDAIAbi['decodeEVMScriptCallData']>) {
  const { data: allowedRecipientMap } = useSingleAllowedRecipientMapAll()

  const recipients = useMemo(() => {
    if (!allowedRecipientMap) return null
    return callData[0].map(address => allowedRecipientMap[address])
  }, [callData, allowedRecipientMap])

  return (
    <div>
      Top up single allowed recipient:
      {callData[0].map((address, i) => (
        <div key={i}>
          <b>{recipients?.[i]}</b> <AddressInlineWithPop address={address} />{' '}
          with {formatEther(callData[1][i])} {TOKEN}
        </div>
      ))}
    </div>
  )
}
