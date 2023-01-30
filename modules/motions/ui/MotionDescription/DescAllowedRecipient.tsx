import { useMemo } from 'react'
import {
  useRecipientMapAll,
  useRecipientAll,
  REGISTRY_WITH_LIMITS_BY_MOTION_TYPE,
  useTokenByTopUpType,
} from 'modules/motions/hooks'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { MotionTypeDisplayNames } from 'modules/motions/utils'

import { formatEther } from 'ethers/lib/utils'
import {
  AddAllowedRecipientLDOAbi,
  RemoveAllowedRecipientLDOAbi,
  TopUpAllowedRecipientsLDOAbi,
} from 'generated'
import { NestProps } from './types'

export function DescAllowedRecipientAdd({
  callData,
  registryType,
}: NestProps<AddAllowedRecipientLDOAbi['decodeEVMScriptCallData']> & {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE
}) {
  const name = MotionTypeDisplayNames[registryType]

  return (
    <div>
      {name} <b>“{callData[1]}”</b> with address{' '}
      <AddressInlineWithPop address={callData[0]} />
    </div>
  )
}

export function DescAllowedRecipientTopUp({
  callData,
  registryType,
}: NestProps<TopUpAllowedRecipientsLDOAbi['decodeEVMScriptCallData']> & {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE
}) {
  const token = useTokenByTopUpType({ registryType })
  const { data: allowedRecipientMap } = useRecipientMapAll({
    registryType,
  })

  const recipients = useMemo(() => {
    if (!allowedRecipientMap) return null
    return callData[0].map(address => allowedRecipientMap[address])
  }, [callData, allowedRecipientMap])

  const name = MotionTypeDisplayNames[registryType]

  return (
    <div>
      ${name}:
      {callData[0].map((address, i) => (
        <div key={i}>
          <b>{recipients?.[i]}</b> <AddressInlineWithPop address={address} />{' '}
          with {Number(formatEther(callData[1][i])).toLocaleString('en-EN')}{' '}
          {token.label}
        </div>
      ))}
    </div>
  )
}

export function DescAllowedRecipientRemove({
  callData,
  registryType,
}: NestProps<RemoveAllowedRecipientLDOAbi['decodeEVMScriptCallData']> & {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE
}) {
  const { data: allowedRecipients } = useRecipientAll({
    registryType,
  })

  const program = useMemo(() => {
    if (!allowedRecipients) return null
    return allowedRecipients.find(p => p.address === callData)
  }, [callData, allowedRecipients])

  const name = MotionTypeDisplayNames[registryType]

  return (
    <div>
      ${name} <b>{program?.title}</b> with address{' '}
      <AddressInlineWithPop address={callData} />
    </div>
  )
}
