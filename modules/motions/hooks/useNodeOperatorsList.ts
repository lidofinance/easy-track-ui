import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  NODE_OPERATORS_REGISTRY_MAP,
  NodeOperatorsRegistryType,
} from '../constants'
import { MAX_PROVIDER_BATCH } from 'modules/config'
import { processInBatches } from 'modules/blockChain/utils/processInBatches'
import { NodeOperator } from '../types'
import { getSDVTOperatorManagerAddress } from '../utils/getSDVTOperatorManagerAddress'

export function useNodeOperatorsList(registryType: NodeOperatorsRegistryType) {
  const { chainId, rpcProvider } = useWeb3()

  return useSWR(
    `${chainId}-${registryType}-operators-list`,
    async () => {
      try {
        const registry = await NODE_OPERATORS_REGISTRY_MAP[
          registryType
        ].connect({
          chainId,
          provider: rpcProvider,
        })

        const count = (await registry.getNodeOperatorsCount()).toNumber()

        const indexes = Array.from(Array(count)).map((_, i) => i)

        const fetchNodeOperator = async (i: number) => {
          const nodeOperator = await registry.getNodeOperator(i, true)
          let managerAddress: string | undefined
          if (registryType === 'sdvt') {
            managerAddress = getSDVTOperatorManagerAddress(chainId, i)
          }
          return { ...nodeOperator, id: i, managerAddress }
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
          .filter(Boolean) as NodeOperator[]
      } catch (error) {
        return []
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  )
}
