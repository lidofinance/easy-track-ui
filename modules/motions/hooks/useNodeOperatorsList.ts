import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  NODE_OPERATORS_REGISTRY_MAP,
  NodeOperatorsRegistryType,
} from '../constants'

export function useNodeOperatorsList(registryType: NodeOperatorsRegistryType) {
  const { chainId, account } = useWeb3()

  return useSWR(
    `${chainId}-${account}-${registryType}-operators-list`,
    async () => {
      try {
        const registry = NODE_OPERATORS_REGISTRY_MAP[registryType].connectRpc({
          chainId,
        })

        const count = (await registry.getNodeOperatorsCount()).toNumber()

        return await Promise.all(
          Array.from(Array(count)).map(async (_, i) => {
            const nodeOperator = await registry.getNodeOperator(i, true)
            return { ...nodeOperator, id: i }
          }),
        )
      } catch (error) {
        return []
      }
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )
}
