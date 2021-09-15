import { useSWR } from 'modules/network/hooks/useSwr'
import { ContractNodeOperatorsRegistry } from 'modules/blockChain/contracts'
import { SWRConfiguration } from 'swr'
import { UnpackedPromise } from 'modules/shared/utils/utilTypes'

type NodeOperator = UnpackedPromise<
  ReturnType<
    ReturnType<
      typeof ContractNodeOperatorsRegistry['connect']
    >['getNodeOperator']
  >
>

export function useNodeOperatorsList(
  swrConfig?: SWRConfiguration<NodeOperator[]>,
) {
  const registry = ContractNodeOperatorsRegistry.useWeb3()

  const nodeOperatorsList = useSWR(
    `${registry.address}-operators-list`,
    async () => {
      const count = (await registry.getActiveNodeOperatorsCount()).toNumber()
      const nodeOperators = await Promise.all(
        Array.from(Array(count)).map((_, i) =>
          registry.getNodeOperator(i, true),
        ),
      )
      return nodeOperators
    },
    swrConfig,
  )

  return nodeOperatorsList
}
