import { EvmRegisterGroupsInOperatorsGridAbi } from 'generated'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import React from 'react'
import { NestProps } from './types'

// RegisterGroupsInOperatorGrid
export function DescVaultsRegisterGroupsInOperatorGrid({
  callData,
}: NestProps<EvmRegisterGroupsInOperatorsGridAbi['decodeEVMScriptCallData']>) {
  const [nodeOperators, tierLimits, tiers] = callData

  return (
    <>
      {Array.from({ length: callData.length }, (_, i) => i).map(index => {
        return (
          <div key={index}>
            — Register group for node operator{' '}
            <AddressInlineWithPop address={nodeOperators[index]} /> with share
            limit {tierLimits[index]} and tiers:
            {tiers[index].map((tier, tierIndex) => (
              <React.Fragment key={`${index}.tierIndex`}>
                <span>Tier #{tierIndex}</span>
                <ul>
                  <li>
                    <b>Share limit:</b> {tier.shareLimit};
                  </li>
                  <li>
                    <b>Reserve ratio (BP):</b> {tier.reserveRatioBP};
                  </li>
                  <li>
                    <b>Forced rebalance threshold (BP):</b>{' '}
                  </li>
                  <li>
                    <b>Infrastructure fee (BP):</b> {tier.infraFeeBP};
                  </li>
                  <li>
                    <b>Liquidity fee (BP):</b> {tier.liquidityFeeBP};
                  </li>
                  <li>
                    <b>Reservation fee (BP):</b> {tier.reservationFeeBP};
                  </li>
                </ul>
                <br />
              </React.Fragment>
            ))}
          </div>
        )
      })}
    </>
  )
}
