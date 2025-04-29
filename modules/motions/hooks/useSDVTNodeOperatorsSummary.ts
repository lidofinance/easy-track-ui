import { BigNumber } from 'ethers'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractSDVTRegistry } from 'modules/blockChain/contracts'
import { useSDVTNodeOperatorsList } from './useSDVTNodeOperatorsList'
import { useLidoSWRImmutable } from '@lido-sdk/react'

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
      if (!Array.isArray(nodeOperatorsList)) {
        return
      }

      const summaryMap: Record<number, NodeOperatorSummary> = {}

      for (const nodeOperator of nodeOperatorsList) {
        const summary = await registry.getNodeOperatorSummary(nodeOperator.id)
        summaryMap[nodeOperator.id] = summary
      }

      return summaryMap
    },
  )
}
