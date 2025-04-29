import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractSDVTRegistry } from 'modules/blockChain/contracts'
import { useLidoSWRImmutable } from '@lido-sdk/react'

export function useSDVTNodeOperatorsList() {
  const { chainId } = useWeb3()
  const registry = ContractSDVTRegistry.useRpc()

  return useLidoSWRImmutable(`sdvt-operators-list-${chainId}`, async () => {
    const count = (await registry.getNodeOperatorsCount()).toNumber()

    const nodeOperators = await Promise.all(
      Array.from(Array(count)).map(async (_, i) => {
        const nodeOperator = await registry.getNodeOperator(i, true)
        return {
          ...nodeOperator,
          id: i,
        }
      }),
    )
    return nodeOperators
  })
}
