import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractSDVTRegistry } from 'modules/blockChain/contracts'

export function useSDVTOperatorsCounts() {
  const chainId = useWeb3()
  const registry = ContractSDVTRegistry.useRpc()

  return useSWR(
    `sdvt-operators-counts-${chainId}-${registry.address}`,
    async () => {
      const [current, max] = await Promise.all([
        registry.getNodeOperatorsCount(),
        registry.MAX_NODE_OPERATORS_COUNT(),
      ])
      return { current: current.toNumber(), max: max.toNumber() }
    },
  )
}

export function useSDVTOperatorNameLimit() {
  const chainId = useWeb3()
  const registry = ContractSDVTRegistry.useRpc()

  return useSWR(
    `sdvt-operator-name-length-${chainId}-${registry.address}`,
    async () => registry.MAX_NODE_OPERATOR_NAME_LENGTH(),
  )
}
