import { BigNumber } from 'ethers'
import { EvmUpdateGroupsShareLimitAbi } from 'generated'
import { useSWR } from 'modules/network/hooks/useSwr'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useOperatorGridGroup } from 'modules/vaults/hooks/useOperatorGridGroup'
import React from 'react'
import { NestProps } from './types'

// UpdateGroupsShareLimit
export function DescVaultsUpdateGroupsShareLimit({
  callData,
  isOnChain,
}: NestProps<EvmUpdateGroupsShareLimitAbi['decodeEVMScriptCallData']>) {
  const { getOperatorGridGroup } = useOperatorGridGroup()

  const { data } = useSWR(
    isOnChain ? `vaults-update-groups-share-limit-desc` : null,
    async () => {
      if (!isOnChain) {
        return null
      }
      const nodeOperators = callData[0]
      const result: BigNumber[] = []

      for (const nodeOperator of nodeOperators) {
        const group = await getOperatorGridGroup(nodeOperator)
        result.push(group?.shareLimit ?? BigNumber.from(0))
      }
      return result
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const currentShareLimits = data ?? []
  const [nodeOperators, newShareLimits] = callData

  return (
    <ul>
      {Array.from({ length: nodeOperators.length }, (_, i) => i).map(index => {
        const nodeOperator = nodeOperators[index]
        const currentShareLimit = currentShareLimits[index]
        const newShareLimit = newShareLimits[index]
        return (
          <li key={index}>
            Group group with node operator{' '}
            <AddressInlineWithPop address={nodeOperator} />
            {isOnChain && data ? ` from ${currentShareLimit.toString()} ` : ''}
            {`to ${newShareLimit.toString()}`}
          </li>
        )
      })}
    </ul>
  )
}
