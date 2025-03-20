import { useMemo } from 'react'
import {
  useRecipientMapAll,
  REGISTRY_WITH_LIMITS_BY_MOTION_TYPE,
  useTokenByTopUpType,
} from 'modules/motions/hooks'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

import { formatEther, isAddress } from 'ethers/lib/utils'
import { TopUpWithLimitsAbi } from 'generated'
import { NestProps } from './types'

export function DescTopUpWithLimits({
  callData,
  registryType,
}: NestProps<TopUpWithLimitsAbi['decodeEVMScriptCallData']> & {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE
}) {
  const { data: allowedRecipientMap } = useRecipientMapAll({ registryType })
  const token = useTokenByTopUpType({ registryType })

  const recipients = useMemo(() => {
    if (!allowedRecipientMap) return null
    return callData[0].map(address => allowedRecipientMap[address])
  }, [callData, allowedRecipientMap])

  return (
    <div>
      Top up single allowed recipient:
      {callData[0].map((address, i) => {
        const recipientName = recipients?.[i]

        const shouldShowName =
          recipientName &&
          (!isAddress(recipientName) ||
            recipientName.toLowerCase() !== address.toLowerCase())

        return (
          <div key={i}>
            {shouldShowName ? <b>{recipientName} </b> : null}
            <AddressInlineWithPop address={address} /> with{' '}
            {Number(formatEther(callData[1][i])).toLocaleString('en-EN')}{' '}
            {token.label}
          </div>
        )
      })}
    </div>
  )
}
