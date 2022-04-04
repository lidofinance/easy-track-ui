import { CHAINS } from '@lido-sdk/constants'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractNodeOperatorsRegistry } from 'modules/blockChain/contracts'
import type { UnpackedPromise } from '@lido-sdk/react/dist/esm/hooks/types'

export function useNodeOperatorsList() {
  const { chainId, account } = useWeb3()
  const registry = ContractNodeOperatorsRegistry.useRpc()

  const nodeOperatorsList = useSWR(
    `${registry.address}-${chainId}-${account}-operators-list`,
    async () => {
      const isRegistrySupported = chainId !== CHAINS.Rinkeby
      if (!isRegistrySupported) {
        return {
          list: [] as UnpackedPromise<
            ReturnType<typeof registry.getNodeOperator>
          >[],
          isRegistrySupported,
        }
      }
      const count = (await registry.getActiveNodeOperatorsCount()).toNumber()
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
