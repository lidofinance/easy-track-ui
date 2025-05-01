import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  NODE_OPERATORS_REGISTRY_MAP,
  NodeOperatorsRegistryType,
} from '../constants'
import { useConfig } from 'modules/config/hooks/useConfig'
import { MAX_PROVIDER_BATCH } from 'modules/blockChain/constants'
import { processInBatches } from 'modules/blockChain/utils/processInBatches'

export function useNodeOperatorsList(registryType: NodeOperatorsRegistryType) {
  const { chainId, account } = useWeb3()
  const { getRpcUrl } = useConfig()

  return useSWR(
    `${chainId}-${account}-${registryType}-operators-list`,
    async () => {
      try {
        const registry = await NODE_OPERATORS_REGISTRY_MAP[
          registryType
        ].connectRpc({
          chainId,
          rpcUrl: getRpcUrl(chainId),
          // separate cache for sandbox and curated registries to avoid batching issues
          // when using one cached batching provider for both we can get batches from both registries in one request
          // which triggers api/rpc batch limit even though both registries separately are under the limit
          cacheSeed: registryType === 'sandbox' ? 1 : 0,
        })

        const count = (await registry.getNodeOperatorsCount()).toNumber()

        const indexes = Array.from(Array(count)).map((_, i) => i)

        const fetchNodeOperator = async (i: number) => {
          const nodeOperator = await registry.getNodeOperator(i, true)
          return { ...nodeOperator, id: i }
        }

        const results = await processInBatches(
          indexes,
          MAX_PROVIDER_BATCH,
          fetchNodeOperator,
        )

        return results
          .map(result => {
            if (result.status === 'fulfilled') {
              return result.value
            }
            console.error('Failed to fetch node operator:', result.reason)
            return null
          })
          .filter(Boolean)
      } catch (error) {
        return []
      }
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )
}
