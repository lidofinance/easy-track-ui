import { utils } from 'ethers'
import { EvmRegisterGroupsInOperatorsGridAbi } from 'generated'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useShareRate } from 'modules/vaults/hooks/useShareRate'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import React from 'react'
import { NestProps } from './types'

const ONE_ETHER = utils.parseEther('1')

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

        const stEthAmountOfShares = shareLimit
          .mul(shareRate ?? 0)
          .div(ONE_ETHER)

        return (
          <li key={index}>
            Group with node operator{' '}
            <AddressInlineWithPop address={nodeOperator} />, share limit{' '}
            <b>
              {formatVaultParam(shareLimit)}
              {!stEthAmountOfShares.isZero() &&
                ` (~${formatVaultParam(stEthAmountOfShares)} stETH)`}
            </b>{' '}
            and tiers:
            <br />
            {tiers[index].map((tier, tierIndex) => {
              const stEthAmountOfTierShareLimit = tier.shareLimit
                .mul(shareRate ?? 0)
                .div(ONE_ETHER)
              return (
                <React.Fragment key={`${index}.tierIndex`}>
                  <span>Tier #{tierIndex + 1}</span>
                  <ul>
                    <li>
                      <b>Share limit: </b>
                      {formatVaultParam(tier.shareLimit)}
                      {!stEthAmountOfTierShareLimit.isZero() &&
                        ` (~${formatVaultParam(
                          stEthAmountOfTierShareLimit,
                        )} stETH)`}
                      ;
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
