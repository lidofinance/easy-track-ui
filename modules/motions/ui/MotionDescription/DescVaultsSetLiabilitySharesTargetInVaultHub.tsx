import { EvmSetLiabilitySharesTargetInVaultHubAbi } from 'generated'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useShareRate } from 'modules/vaults/hooks/useShareRate'
import { convertSharesToStEthString } from 'modules/vaults/utils/convertSharesToStEthString'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import React from 'react'
import { NestProps } from './types'

// SetLiabilitySharesTargetInVaultHub
export function DescVaultsSetLiabilitySharesTargetInVaultHub({
  callData,
}: NestProps<
  EvmSetLiabilitySharesTargetInVaultHubAbi['decodeEVMScriptCallData']
>) {
  const [vaults, liabilitySharesTargets] = callData

  const { data: shareRate } = useShareRate()

  return (
    <ul>
      {vaults.map((vault, index) => {
        const liabilitySharesTarget = liabilitySharesTargets[index]
        return (
          <li key={index}>
            Set liability shares target for vault{' '}
            <AddressInlineWithPop address={vault} /> to{' '}
            <b>
              {formatVaultParam(liabilitySharesTarget)}
              {convertSharesToStEthString(liabilitySharesTarget, shareRate)}
            </b>
          </li>
        )
      })}
    </ul>
  )
}
