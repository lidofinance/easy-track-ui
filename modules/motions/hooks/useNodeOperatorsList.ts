import { useSWR } from 'modules/network/hooks/useSwr'
import { ContractNodeOperatorsRegistry } from 'modules/blockChain/contracts'

export function useNodeOperatorsList() {
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
  )

  return nodeOperatorsList
}
