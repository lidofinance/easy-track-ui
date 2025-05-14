import { ContractCSMRegistry } from 'modules/blockChain/contracts'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

export const useCSMNodeOperatorsCount = () => {
  const { chainId } = useWeb3()
  const registry = ContractCSMRegistry.useRpc()

  return useSWR(
    [`swr:useCSMNodeOperatorsCount`, chainId],
    async () => {
      const count = (await registry.getNodeOperatorsCount()).toNumber()

      return count
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}
