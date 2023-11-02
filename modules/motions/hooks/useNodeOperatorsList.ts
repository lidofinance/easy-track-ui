import { CHAINS } from '@lido-sdk/constants'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import type { UnpackedPromise } from '@lido-sdk/react/dist/esm/hooks/types'
import {
  NodeOperatorsRegistryType,
  NODE_OPERATORS_REGISTRY_MAP,
} from '../constants'

export function useNodeOperatorsList(registryType?: NodeOperatorsRegistryType) {
  const { chainId, account } = useWeb3()

  const registryKey = registryType ?? 'curated'

  const nodeOperatorsList = useSWR(
    `${chainId}-${account}-${registryKey}-operators-list`,
    async () => {
      const registry = NODE_OPERATORS_REGISTRY_MAP[registryKey].connectRpc({
        chainId,
      })
      const isRegistrySupported = chainId !== CHAINS.Rinkeby
      if (!isRegistrySupported) {
        return {
          list: [] as UnpackedPromise<
            ReturnType<typeof registry.getNodeOperator>
          >[],
          isRegistrySupported,
        }
      }
      const count = (await registry.getNodeOperatorsCount()).toNumber()
      const nodeOperators = await Promise.all(
        Array.from(Array(count)).map((_, i) =>
          registry.getNodeOperator(i, true),
        ),
      )
      return {
        list: nodeOperators,
        isRegistrySupported,
      }
    },
  )

  return nodeOperatorsList
}
