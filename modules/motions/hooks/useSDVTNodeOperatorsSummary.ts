import { BigNumber } from 'ethers'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractSDVTRegistry } from 'modules/blockChain/contracts'
import { useSDVTNodeOperatorsList } from './useSDVTNodeOperatorsList'
import { useLidoSWRImmutable } from '@lido-sdk/react'
import { MAX_PROVIDER_BATCH } from 'modules/blockChain/constants'
import { processInBatches } from 'modules/blockChain/utils/processInBatches'

type NodeOperatorSummary = {
  targetValidatorsCount: BigNumber
  stuckValidatorsCount: BigNumber
  refundedValidatorsCount: BigNumber
  stuckPenaltyEndTimestamp: BigNumber
  totalExitedValidators: BigNumber
  totalDepositedValidators: BigNumber
  depositableValidatorsCount: BigNumber
  targetLimitMode: BigNumber
}

export function useSDVTNodeOperatorsSummaryMap() {
  const { chainId } = useWeb3()
  const registry = ContractSDVTRegistry.useRpc()
  const { data: nodeOperatorsList } = useSDVTNodeOperatorsList()

  return useLidoSWRImmutable(
    nodeOperatorsList ? `sdvt-operators-summary-${chainId}` : null,
    async () => {
      if (!Array.isArray(nodeOperatorsList) || nodeOperatorsList.length === 0) {
        return {}
      }

      const results = await processInBatches(
        nodeOperatorsList,
        MAX_PROVIDER_BATCH,
        async nodeOperator => {
          const summary = await registry.getNodeOperatorSummary(nodeOperator.id)
          return { id: nodeOperator.id, summary }
        },
      )

      const summaryMap: Record<number, NodeOperatorSummary> = {}

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const { id, summary } = result.value
          summaryMap[id] = summary
        } else {
          console.error('Failed to fetch node operator summary:', result.reason)
        }
      }

      return summaryMap
    },
  )
}
