import { BigNumber } from 'ethers'
import { EvmAlterTiersInOperatorGridAbi } from 'generated'
import { ContractOperatorGrid } from 'modules/blockChain/contracts'
import { useSWR } from 'modules/network/hooks/useSwr'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useShareRate } from 'modules/vaults/hooks/useShareRate'
import { convertSharesToStEthString } from 'modules/vaults/utils/convertSharesToStEthString'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import React from 'react'
import { NestProps } from './types'

// Copies of original types without array part
type TierParamsStructOutputCopy = {
  shareLimit: BigNumber
  reserveRatioBP: BigNumber
  forcedRebalanceThresholdBP: BigNumber
  infraFeeBP: BigNumber
  liquidityFeeBP: BigNumber
  reservationFeeBP: BigNumber
}

type TierStructOutputCopy = {
  operator: string
  shareLimit: BigNumber
  liabilityShares: BigNumber
  reserveRatioBP: number
  forcedRebalanceThresholdBP: number
  infraFeeBP: number
  liquidityFeeBP: number
  reservationFeeBP: number
}

// AlterTiersInOperatorGrid
export function DescVaultsAlterTiersInOperatorGrid({
  callData,
}: NestProps<EvmAlterTiersInOperatorGridAbi['decodeEVMScriptCallData']>) {
  const operatorGrid = ContractOperatorGrid.useRpc()
  const { data: shareRate } = useShareRate()
  const [tierIds, tierParamsUpdates] = callData

  const { data, initialLoading } = useSWR(
    `vaults-register-tiers-desc-${tierIds.map(t => t.toString()).join('-')}`,
    async () => {
      console.log('Fetching tier data for tierIds:', tierIds)
      const tiersData = await Promise.all(
        tierIds.map(async tierId => operatorGrid.tier(tierId)),
      )

      return tiersData.reduce((acc, tierData, index) => {
        const value = {
          tierId: tierIds[index].toString(),
          before: tierData,
          after: tierParamsUpdates[index],
        }
        if (!acc[tierData.operator]) {
          acc[tierData.operator] = [value]
        } else {
          acc[tierData.operator]!.push(value)
        }
        return acc
      }, {} as Record<string, { tierId: string; before: TierStructOutputCopy; after: TierParamsStructOutputCopy }[] | undefined>)
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  if (initialLoading) {
    return <>Loading...</>
  }

  if (!data) {
    return <>No data</>
  }

  const renderParamUpdate = (
    before: BigNumber | number | undefined,
    after: BigNumber,
    isBp: boolean,
  ) => {
    const convertedSharesAfter = isBp
      ? ''
      : convertSharesToStEthString(after, shareRate)

    if (before === undefined) {
      return `${formatVaultParam(after, isBp)}${convertedSharesAfter}`
    }
    if (after.eq(before)) {
      return (
        <>
          {formatVaultParam(after, isBp)}
          {convertedSharesAfter} <b>(no change)</b>
        </>
      )
    }

    return `from ${formatVaultParam(before, isBp)} to ${formatVaultParam(
      after,
      isBp,
    )}${convertedSharesAfter}`
  }

  return (
    <>
      <ol>
        {Object.entries(data).map(([operator, tiers]) => {
          if (!tiers) return null

          const s = tiers.length > 1 ? 's' : ''
          return (
            <li key={operator}>
              Alter tier{s} for a group with node operator{' '}
              <AddressInlineWithPop address={operator} />:
              <br />
              {tiers.map((tier, index) => (
                <React.Fragment key={index}>
                  <span>Tier with global tierId {tier.tierId.toString()}:</span>
                  <ul>
                    <li>
                      <b>Share limit: </b>
                      {renderParamUpdate(
                        tier.before.shareLimit,
                        tier.after.shareLimit,
                        false,
                      )}
                      ;
                    </li>
                    <li>
                      <b>Reserve ratio: </b>
                      {renderParamUpdate(
                        tier.before.reserveRatioBP,
                        tier.after.reserveRatioBP,
                        true,
                      )}
                      ;
                    </li>
                    <li>
                      <b>Forced rebalance threshold: </b>
                      {renderParamUpdate(
                        tier.before.forcedRebalanceThresholdBP,
                        tier.after.forcedRebalanceThresholdBP,
                        true,
                      )}
                      ;
                    </li>
                    <li>
                      <b>Infra fee: </b>
                      {renderParamUpdate(
                        tier.before.infraFeeBP,
                        tier.after.infraFeeBP,
                        true,
                      )}
                      ;
                    </li>
                    <li>
                      <b>Liquidity fee:</b>{' '}
                      {renderParamUpdate(
                        tier.before.liquidityFeeBP,
                        tier.after.liquidityFeeBP,
                        true,
                      )}
                      ;
                    </li>
                    <li>
                      <b>Reservation liquidity fee:</b>{' '}
                      {renderParamUpdate(
                        tier.before.reservationFeeBP,
                        tier.after.reservationFeeBP,
                        true,
                      )}
                      .
                    </li>
                  </ul>
                </React.Fragment>
              ))}
            </li>
          )
        })}
      </ol>
    </>
  )
}
