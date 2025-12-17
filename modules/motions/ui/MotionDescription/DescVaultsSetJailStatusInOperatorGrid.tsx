import { EvmSetJailStatusInOperatorGridAbi } from 'generated'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import React from 'react'
import { NestProps } from './types'

// SetJailStatusInOperatorGrid
export function DescVaultsSetJailStatusInOperatorGrid({
  callData,
}: NestProps<EvmSetJailStatusInOperatorGridAbi['decodeEVMScriptCallData']>) {
  const [vaults, jailStatuses] = callData

  return (
    <ul>
      {vaults.map((vault, index) => {
        return (
          <li key={index}>
            Set vault <AddressInlineWithPop address={vault} /> jail status to{' '}
            <b>{jailStatuses[index] ? 'true' : 'false'}</b>;
          </li>
        )
      })}
    </ul>
  )
}
