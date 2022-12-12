import { useMemo } from 'react'
import {
  useMapAll,
  REGISTRY_WITH_LIMITS_BY_MOTION_TYPE,
  useTokenByTopUpType,
} from 'modules/motions/hooks'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

import { formatEther } from 'ethers/lib/utils'
import { TopUpWithLimitsAbi } from 'generated'
import { NestProps } from './types'

export function DescTopUpWithLimits({
  callData,
  registryType,
}: NestProps<TopUpWithLimitsAbi['decodeEVMScriptCallData']> & {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE
}) {
  const { data: allowedRecipientMap } = useMapAll({ registryType })
  const token = useTokenByTopUpType({ registryType })

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
          with {formatEther(callData[1][i])} {token.label}
        </div>
      ))}
    </div>
  )
}
