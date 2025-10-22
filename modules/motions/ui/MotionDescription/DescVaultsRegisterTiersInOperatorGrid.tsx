import { EvmRegisterTiersInOperatorsGridAbi } from 'generated'
import { useSWR } from 'modules/network/hooks/useSwr'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useOperatorGridGroup } from 'modules/vaults/hooks/useOperatorGridGroup'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import React from 'react'
import { NestProps } from './types'

// RegisterTiersInOperatorGrid
export function DescVaultsRegisterTiersInOperatorGrid({
  callData,
  isOnChain,
}: NestProps<EvmRegisterTiersInOperatorsGridAbi['decodeEVMScriptCallData']>) {
  const { getOperatorGridGroup } = useOperatorGridGroup()
  const [nodeOperators, tiers] = callData

  const { data: tiersCounts } = useSWR(
    isOnChain ? `vaults-register-tiers-desc` : null,
    async () => {
      if (!isOnChain) {
        return null
      }
      const result: number[] = []

      for (const nodeOperator of nodeOperators) {
        const group = await getOperatorGridGroup(nodeOperator)
        result.push(group?.tierIds.length ?? 0)
      }
      return result
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return (
    <ol>
      {Array.from({ length: nodeOperators.length }, (_, i) => i).map(index => {
        const tiersList = tiers[index]
        const s = tiersList.length > 1 ? 's' : ''
        const tiersCount = (tiersCounts ?? [])[index] ?? 0

        return (
          <li key={index}>
            Tier{s} for a group with node operator{' '}
            <AddressInlineWithPop address={nodeOperators[index]} />:
            {tiers[index].map((tier, tierIndex) => (
              <React.Fragment key={`${index}.tierIndex`}>
                <span>Tier #{tierIndex + tiersCount + 1}</span>
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
