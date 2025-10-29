import { EvmRegisterGroupsInOperatorsGridAbi } from 'generated'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useShareRate } from 'modules/vaults/hooks/useShareRate'
import { convertSharesToStEthString } from 'modules/vaults/utils/convertSharesToStEthString'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import React from 'react'
import { NestProps } from './types'

// RegisterGroupsInOperatorGrid
export function DescVaultsRegisterGroupsInOperatorGrid({
  callData,
}: NestProps<EvmRegisterGroupsInOperatorsGridAbi['decodeEVMScriptCallData']>) {
  const [nodeOperators, shareLimits, tiers] = callData

  const { data: shareRate } = useShareRate()

  return (
    <ol>
      {nodeOperators.map((nodeOperator, index) => {
        const shareLimit = shareLimits[index]

        return (
          <li key={index}>
            Group with node operator{' '}
            <AddressInlineWithPop address={nodeOperator} />, share limit{' '}
            <b>
              {formatVaultParam(shareLimit)}
              {convertSharesToStEthString(shareLimit, shareRate)}
            </b>{' '}
            and tiers:
            <br />
            {tiers[index].map((tier, tierIndex) => {
              return (
                <React.Fragment key={`${index}.${tierIndex}`}>
                  <span>Tier #{tierIndex + 1}</span>
                  <ul>
                    <li>
                      <b>Share limit: </b>
                      {formatVaultParam(tier.shareLimit)}
                      {convertSharesToStEthString(tier.shareLimit, shareRate)};
                    </li>
                    <li>
                      <b>Reserve ratio: </b>
                      {formatVaultParam(tier.reserveRatioBP, true)};
                    </li>
                    <li>
                      <b>Forced rebalance threshold: </b>
                      {formatVaultParam(tier.forcedRebalanceThresholdBP, true)};
                    </li>
                    <li>
                      <b>Infra fee: </b>
                      {formatVaultParam(tier.infraFeeBP, true)};
                    </li>
                    <li>
                      <b>Liquidity fee: </b>
                      {formatVaultParam(tier.liquidityFeeBP, true)};
                    </li>
                    <li>
                      <b>Reservation liquidity fee: </b>
                      {formatVaultParam(tier.reservationFeeBP, true)}.
                    </li>
                  </ul>
                </React.Fragment>
              )
            })}
          </li>
        )
      })}
    </ol>
  )
}
