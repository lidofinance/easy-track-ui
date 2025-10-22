import { EvmRegisterGroupsInOperatorsGridAbi } from 'generated'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import React from 'react'
import { NestProps } from './types'

// RegisterGroupsInOperatorGrid
export function DescVaultsRegisterGroupsInOperatorGrid({
  callData,
}: NestProps<EvmRegisterGroupsInOperatorsGridAbi['decodeEVMScriptCallData']>) {
  const [nodeOperators, tierLimits, tiers] = callData

  return (
    <ol>
      {Array.from({ length: nodeOperators.length }, (_, i) => i).map(index => {
        const tierLimit = formatVaultParam(tierLimits[index])
        return (
          <li key={index}>
            Group with node operator{' '}
            <AddressInlineWithPop address={nodeOperators[index]} />, share limit{' '}
            <b>{tierLimit} stETH</b> and tiers:
            <br />
            {tiers[index].map((tier, tierIndex) => (
              <React.Fragment key={`${index}.tierIndex`}>
                <span>Tier #{tierIndex + 1}</span>
                <ul>
                  <li>
                    <b>Share limit:</b> {formatVaultParam(tier.shareLimit)}{' '}
                    stETH;
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
                    <b>Reservation liquidity fee (BP):</b>{' '}
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
