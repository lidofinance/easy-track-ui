import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from '@lido-sdk/web3-react'
import { ContractNodeOperatorsRegistry } from 'modules/blockChain/contracts'

export function useNodeOperatorsList(shouldCheck: boolean) {
  const { chainId, account } = useWeb3()
  const registry = ContractNodeOperatorsRegistry.useWeb3()

  const nodeOperatorsList = useSWR(
    shouldCheck
      ? `${registry.address}-${chainId}-${account}-operators-list`
      : null,
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
