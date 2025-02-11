import {
  useRecipientMapAll,
  REGISTRY_WITH_LIMITS_BY_MOTION_TYPE,
} from 'modules/motions/hooks'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

import { formatUnits, isAddress } from 'ethers/lib/utils'
import { TopUpWithLimitsStablesAbi } from 'generated'
import { NestProps } from './types'
import { useMotionTokenData } from 'modules/motions/hooks/useMotionTokenData'

type Props = NestProps<TopUpWithLimitsStablesAbi['decodeEVMScriptCallData']> & {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE
}

export const DescTopUpWithLimitsAndCustomToken = ({
  callData,
  registryType,
}: Props) => {
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

        const shouldShowName =
          !isAddress(recipientName) ||
          recipientName.toLowerCase() !== address.toLowerCase()

        return (
          <div key={i}>
            {shouldShowName ? <b>{recipientName} </b> : null}
            <AddressInlineWithPop address={address} /> with {formattedAmount}{' '}
            {tokenData ? <b>{tokenData.label}</b> : null}
          </div>
        )
      })}
    </div>
  )
}
