import { EvmRegisterTiersInOperatorsGridAbi } from 'generated'
import { ContractOperatorGrid } from 'modules/blockChain/contracts'
import { useSWR } from 'modules/network/hooks/useSwr'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useShareRate } from 'modules/vaults/hooks/useShareRate'
import { convertSharesToStEthString } from 'modules/vaults/utils/convertSharesToStEthString'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import React from 'react'
import { NestProps } from './types'

// RegisterTiersInOperatorGrid
export function DescVaultsRegisterTiersInOperatorGrid({
  callData,
  isOnChain,
}: NestProps<EvmRegisterTiersInOperatorsGridAbi['decodeEVMScriptCallData']>) {
  const operatorGrid = ContractOperatorGrid.useRpc()
  const [nodeOperators, tiers] = callData

  const { data: shareRate } = useShareRate()

  const { data: tiersCounts } = useSWR(
    isOnChain ? `vaults-register-tiers-desc-${nodeOperators.join('-')}` : null,
    async () => {
      if (!isOnChain) return

      return Promise.all(
        nodeOperators.map(async nodeOperator => {
          const group = await operatorGrid.group(nodeOperator)
          return group.tierIds.length
        }),
      )
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return (
    <ol>
      {nodeOperators.map((nodeOperator, index) => {
        const tiersList = tiers[index]
        const s = tiersList.length > 1 ? 's' : ''
        const tiersCount = (tiersCounts ?? [])[index] ?? 0

        return (
          <li key={index}>
            Tier{s} for a group with node operator{' '}
            <AddressInlineWithPop address={nodeOperator} />:
            <br />
            {tiers[index].map((tier, tierIndex) => (
              <React.Fragment key={`${index}.${tierIndex}`}>
                <span>Tier #{tierIndex + tiersCount + 1}</span>
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
            ))}
          </li>
        )
      })}
    </ol>
  )
}
