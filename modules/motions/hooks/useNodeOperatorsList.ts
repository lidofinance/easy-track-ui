import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  NodeOperatorsRegistryType,
  NODE_OPERATORS_REGISTRY_MAP,
} from '../constants'

export function useNodeOperatorsList(registryType: NodeOperatorsRegistryType) {
  const { chainId, account } = useWeb3()

  const nodeOperatorsList = useSWR(
    `${chainId}-${account}-${registryType}-operators-list`,
    async () => {
      try {
        const registry = NODE_OPERATORS_REGISTRY_MAP[registryType].connectRpc({
          chainId,
        })

        const count = (await registry.getNodeOperatorsCount()).toNumber()
        const nodeOperators = await Promise.all(
          Array.from(Array(count)).map(async (_, i) => {
            const nodeOperator = await registry.getNodeOperator(i, true)
            return { ...nodeOperator, id: i }
          }),
        )
        return nodeOperators
      } catch (error) {
        return []
      }
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  return nodeOperatorsList
}
