import { BigNumber } from 'ethers'
import { EvmAlterTiersInOperatorGridAbi } from 'generated'
import { ContractOperatorGrid } from 'modules/blockChain/contracts'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useShareRate } from 'modules/vaults/hooks/useShareRate'
import { convertSharesToStEthString } from 'modules/vaults/utils/convertSharesToStEthString'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import React from 'react'
import { NestProps } from './types'

// AlterTiersInOperatorGrid
export function DescVaultsAlterTiersInOperatorGrid({
  callData,
  isOnChain,
}: NestProps<EvmAlterTiersInOperatorGridAbi['decodeEVMScriptCallData']>) {
  const operatorGrid = ContractOperatorGrid.useRpc()

  const { data: shareRate } = useShareRate()
  const [tierIds, tierParamsUpdates] = callData

  const { data } = useSWR(
    isOnChain
      ? `vaults-register-tiers-desc-${tierIds.map(t => t.toString()).join('-')}`
      : null,
    async () => {
      if (!isOnChain) return

      return Promise.all(
        tierIds.map(async tierId => {
          const tier = await operatorGrid.tier(tierId)
          return tier
        }),
      )
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const renderParamUpdate = (
    before: BigNumber | number | undefined,
    after: BigNumber,
    isBp: boolean,
  ) => {
    if (!before) {
      return formatVaultParam(after, isBp)
    }
    if (after.eq(before)) {
      return `${formatVaultParam(after, isBp)} (no change)`
    }
    return `from ${formatVaultParam(before, isBp)} to ${formatVaultParam(
      after,
      isBp,
    )}`
  }

  return (
    <>
      {tierIds.map((tierId, index) => {
        const currentParams = isOnChain ? (data ?? [])[index] : undefined
        const updatedParams = tierParamsUpdates[index]

        return (
          <li key={index}>
            Tier with global tierId {tierId.toString()}:
            <ul>
              <li>
                <b>Share limit: </b>
                {renderParamUpdate(
                  currentParams?.shareLimit,
                  updatedParams.shareLimit,
                  false,
                )}
                {convertSharesToStEthString(
                  updatedParams.shareLimit,
                  shareRate,
                )}
                ;
              </li>
              <li>
                <b>Reserve ratio: </b>
                {renderParamUpdate(
                  currentParams?.reserveRatioBP,
                  updatedParams.reserveRatioBP,
                  true,
                )}
                ;
              </li>
              <li>
                <b>Forced rebalance threshold: </b>
                {renderParamUpdate(
                  currentParams?.forcedRebalanceThresholdBP,
                  updatedParams.forcedRebalanceThresholdBP,
                  true,
                )}
                ;
              </li>
              <li>
                <b>Infra fee: </b>
                {renderParamUpdate(
                  currentParams?.infraFeeBP,
                  updatedParams.infraFeeBP,
                  true,
                )}
                ;
              </li>
              <li>
                <b>Liquidity fee:</b>{' '}
                {renderParamUpdate(
                  currentParams?.liquidityFeeBP,
                  updatedParams.liquidityFeeBP,
                  true,
                )}
                ;
              </li>
              <li>
                <b>Reservation liquidity fee:</b>{' '}
                {renderParamUpdate(
                  currentParams?.reservationFeeBP,
                  updatedParams.reservationFeeBP,
                  true,
                )}
                .
              </li>
            </ul>
          </li>
        )
      })}
    </>
  )
}
