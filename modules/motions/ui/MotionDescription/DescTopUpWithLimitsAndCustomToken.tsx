import {
  useRecipientMapAll,
  REGISTRY_WITH_LIMITS_BY_MOTION_TYPE,
} from 'modules/motions/hooks'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

import { formatUnits } from 'ethers/lib/utils'
import { TopUpWithLimitsStablesAbi } from 'generated'
import { NestProps } from './types'
import { useMotionTokenData } from 'modules/motions/hooks/useMotionTokenData'

export function DescTopUpWithLimitsAndCustomToken({
  callData,
  registryType,
}: NestProps<TopUpWithLimitsStablesAbi['decodeEVMScriptCallData']> & {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE
}) {
  const { data: allowedRecipientMap, initialLoading: isRecipientDataLoading } =
    useRecipientMapAll({ registryType })

  const { tokenData, isTokenDataLoading } = useMotionTokenData(callData.token)

  if (isRecipientDataLoading || !allowedRecipientMap || isTokenDataLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      Top up single allowed recipient:
      {callData.recipients.map((address, i) => {
        const recipientName = allowedRecipientMap[address]
        const formattedAmount = Number(
          formatUnits(callData.amounts[i], tokenData?.decimals),
        ).toLocaleString('en-EN')

        return (
          <div key={i}>
            <b>{recipientName} </b>
            <AddressInlineWithPop address={address} /> with {formattedAmount}{' '}
            {tokenData ? <b>{tokenData.label}</b> : null}
          </div>
        )
      })}
    </div>
  )
}
