import { EvmForceValidatorExitsInVaultHubAbi } from 'generated'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import React from 'react'
import { NestProps } from './types'

// ForceValidatorExitsInVaultHub
export function DescVaultsForceValidatorExitsInVaultHub({
  callData,
}: NestProps<EvmForceValidatorExitsInVaultHubAbi['decodeEVMScriptCallData']>) {
  const [vaults, pubkeys] = callData

  return (
    <ul>
      {vaults.map((vault, index) => {
        return (
          <li key={index}>
            Force validator exit: vault <AddressInlineWithPop address={vault} />
            , pubkey {pubkeys[index]};
          </li>
        )
      })}
    </ul>
  )
}
