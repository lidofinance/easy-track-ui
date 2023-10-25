import {
  useRecipientMapAll,
  REGISTRY_WITH_LIMITS_BY_MOTION_TYPE,
} from 'modules/motions/hooks'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

import { formatUnits } from 'ethers/lib/utils'
import { TopUpWithLimitsStablesAbi } from 'generated'
import { NestProps } from './types'
import { useSWR } from 'modules/network/hooks/useSwr'
import { connectERC20Contract } from 'modules/motions/utils/connectTokenContract'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { DEFAULT_DECIMALS } from 'modules/blockChain/constants'

export function DescTopUpWithLimitsAndCustomToken({
  callData,
  registryType,
}: NestProps<TopUpWithLimitsStablesAbi['decodeEVMScriptCallData']> & {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE
}) {
  const { chainId } = useWeb3()
  const { data: allowedRecipientMap, initialLoading: isRecipientDataLoading } =
    useRecipientMapAll({ registryType })

  const { data: tokenData, initialLoading: isTokenDataLoading } = useSWR(
    `top-up-with-limits-and-custom-token-${callData.token}-${chainId}`,
    async () => {
      try {
        const tokenContract = connectERC20Contract(callData.token, chainId)
        const label = await tokenContract.symbol()
        const decimals = await tokenContract.decimals()

        return {
          label,
          address: callData.token,
          decimals,
        }
      } catch (error) {
        return {
          label: 'Unknown token',
          address: callData.token,
          decimals: DEFAULT_DECIMALS,
        }
      }
    },
  )

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
            {tokenData?.label ?? ''}
          </div>
        )
      })}
    </div>
  )
}
