import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractSDVTRegistry } from 'modules/blockChain/contracts'
import { MAX_PROVIDER_BATCH } from 'modules/config'
import { processInBatches } from 'modules/blockChain/utils/processInBatches'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useSWR } from 'modules/network/hooks/useSwr'

export function useSDVTNodeOperatorsList() {
  const { chainId } = useWeb3()
  const { getRpcUrl } = useConfig()

  const registry = ContractSDVTRegistry.connectRpc({
    chainId,
    rpcUrl: getRpcUrl(chainId),
    cacheSeed: `sdvt-operators-list-${chainId}`,
  })

  return useSWR(
    `sdvt-operators-list-${chainId}`,
    async () => {
      const count = (await registry.getNodeOperatorsCount()).toNumber()
      const indexes = Array.from({ length: count }, (_, i) => i)

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
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  )
}
