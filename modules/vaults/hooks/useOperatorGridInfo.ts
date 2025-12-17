import { ContractOperatorGrid } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'

export const useOperatorGridInfo = () => {
  const { chainId } = useWeb3()
  const operatorGrid = ContractOperatorGrid.useRpc()

  return useSWR(
    `operator-grid-info-${chainId}`,
    async () => {
      const [tiersCount, nodeOperatorCount] = await Promise.all([
        operatorGrid.tiersCount(),
        operatorGrid.nodeOperatorCount(),
      ])
      return {
        tiersCount: tiersCount.toNumber(),
        nodeOperatorCount: nodeOperatorCount.toNumber(),
      }
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}
