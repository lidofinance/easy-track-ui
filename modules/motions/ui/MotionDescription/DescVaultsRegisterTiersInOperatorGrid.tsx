import { EvmRegisterTiersInOperatorsGridAbi } from 'generated'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import React from 'react'
import { NestProps } from './types'

// RegisterTiersInOperatorGrid
export function DescVaultsRegisterTiersInOperatorGrid({
  callData,
}: NestProps<EvmRegisterTiersInOperatorsGridAbi['decodeEVMScriptCallData']>) {
  const [nodeOperators, tiers] = callData

  return (
    <ol>
      {Array.from({ length: nodeOperators.length }, (_, i) => i).map(index => {
        const tiersList = tiers[index]
        const s = tiersList.length > 1 ? 's' : ''

        return (
          <li key={index}>
            Tier{s} with node operator{' '}
            <AddressInlineWithPop address={nodeOperators[index]} />:
            {tiers[index].map((tier, tierIndex) => (
              <React.Fragment key={`${index}.tierIndex`}>
                <span>Tier #{tierIndex + 1}</span>
                <ul>
                  <li>
                    <b>Share limit:</b> {formatVaultParam(tier.shareLimit)};
                  </li>
                  <li>
                    <b>Reserve ratio (BP):</b>{' '}
                    {formatVaultParam(tier.reserveRatioBP, true)};
                  </li>
                  <li>
                    <b>Forced rebalance threshold (BP):</b>{' '}
                  </li>
                  <li>
                    <b>Infra fee (BP):</b>{' '}
                    {formatVaultParam(tier.infraFeeBP, true)};
                  </li>
                  <li>
                    <b>Liquidity fee (BP):</b>{' '}
                    {formatVaultParam(tier.liquidityFeeBP, true)};
                  </li>
                  <li>
                    <b>Reservation fee (BP):</b>{' '}
                    {formatVaultParam(tier.reservationFeeBP, true)}.
                  </li>
                </ul>
              </React.Fragment>
            ))}
          </li>
        )
      })}
    </ol>
  )
}
