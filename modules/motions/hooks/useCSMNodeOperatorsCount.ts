import { useLidoSWR } from '@lido-sdk/react'
import { ContractCSMRegistry } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

export const useCSMNodeOperatorsCount = () => {
  const { chainId } = useWeb3()
  const registry = ContractCSMRegistry.useRpc()

  return useLidoSWR(
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
