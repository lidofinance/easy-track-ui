import { EvmSocializeBadDebtInVaultHubAbi } from 'generated'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useShareRate } from 'modules/vaults/hooks/useShareRate'
import { convertSharesToStEthString } from 'modules/vaults/utils/convertSharesToStEthString'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import React from 'react'
import { NestProps } from './types'

// SocializeBadDebtInVaultHub
export function DescVaultsSocializeBadDebtInVaultHub({
  callData,
}: NestProps<EvmSocializeBadDebtInVaultHubAbi['decodeEVMScriptCallData']>) {
  const [vaults, acceptorAddresses, maxSharesToSocialize] = callData

  const { data: shareRate } = useShareRate()

  return (
    <ul>
      {vaults.map((vault, index) => {
        const acceptorAddress = acceptorAddresses[index]
        const maxShareToSocialize = maxSharesToSocialize[index]
        return (
          <li key={index}>
            Socialize bad debt in vault <AddressInlineWithPop address={vault} />
            :{' '}
            <b>
              {formatVaultParam(maxShareToSocialize)}
              {convertSharesToStEthString(maxShareToSocialize, shareRate)}
            </b>{' '}
            to acceptor <AddressInlineWithPop address={acceptorAddress} />
          </li>
        )
      })}
    </ul>
  )
}
