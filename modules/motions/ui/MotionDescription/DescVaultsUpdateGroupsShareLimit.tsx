import { EvmUpdateGroupsShareLimitAbi } from 'generated'
import { ContractOperatorGrid } from 'modules/blockChain/contracts'
import { useSWR } from 'modules/network/hooks/useSwr'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useShareRate } from 'modules/vaults/hooks/useShareRate'
import { convertSharesToStEthString } from 'modules/vaults/utils/convertSharesToStEthString'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import React from 'react'
import { NestProps } from './types'

// UpdateGroupsShareLimit
export function DescVaultsUpdateGroupsShareLimit({
  callData,
  isOnChain,
}: NestProps<EvmUpdateGroupsShareLimitAbi['decodeEVMScriptCallData']>) {
  const operatorGrid = ContractOperatorGrid.useRpc()
  const [nodeOperators, newShareLimits] = callData

  const { data: shareRate } = useShareRate()

  const { data } = useSWR(
    isOnChain
      ? `vaults-update-groups-share-limit-desc-${nodeOperators.join('-')}`
      : null,
    async () => {
      if (!isOnChain) return

      return Promise.all(
        nodeOperators.map(async nodeOperator => {
          const group = await operatorGrid.group(nodeOperator)
          return group.shareLimit
        }),
      )
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const currentShareLimits = data ?? []

  return (
    <ul>
      {Array.from({ length: nodeOperators.length }, (_, i) => i).map(index => {
        const nodeOperator = nodeOperators[index]
        const currentShareLimit = currentShareLimits[index]
        const newShareLimit = newShareLimits[index]
        return (
          <li key={index}>
            Update share limit of group with node operator{' '}
            <AddressInlineWithPop address={nodeOperator} />{' '}
            {isOnChain && data
              ? ` from ${formatVaultParam(currentShareLimit)} `
              : ''}
            {`to ${formatVaultParam(newShareLimit)}${convertSharesToStEthString(
              newShareLimit,
              shareRate,
            )}`}
          </li>
        )
      })}
    </ul>
  )
}
