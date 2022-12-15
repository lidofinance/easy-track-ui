import { utils } from 'ethers'
import { useMemo } from 'react'
import { useLegoTokenOptions } from 'modules/motions/hooks/useLegoTokenOptions'

import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

import { EvmTopUpLegoProgramAbi } from 'generated'
import { formatEther } from 'ethers/lib/utils'
import { NestProps } from './types'

// LEGOTopUp
export function DescLEGOTopUp({
  callData,
}: NestProps<EvmTopUpLegoProgramAbi['decodeEVMScriptCallData']>) {
  const options = useLegoTokenOptions()
  const formattedTokens = useMemo(() => {
    return callData[0].map(
      address =>
        options.find(
          o => utils.getAddress(o.value) === utils.getAddress(address),
        )?.label,
    )
  }, [callData, options])
  return (
    <div>
      Top up LEGO program with:
      {callData[0].map((_, i) => (
        <div key={i}>
          {Number(formatEther(callData[1][i])).toLocaleString('en-EN')}{' '}
          {formattedTokens[i] || (
            <>
              token with address{' '}
              <AddressInlineWithPop address={callData[0][i]} />
            </>
          )}
        </div>
      ))}
    </div>
  )
}
