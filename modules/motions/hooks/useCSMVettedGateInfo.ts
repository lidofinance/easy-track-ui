import { CSMVettedGateTreeAbi__factory } from 'generated'
import { ContractCSMSetVettedGateTree } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'

export const useCSMVettedGateInfo = () => {
  const { chainId, rpcProvider } = useWeb3()

  return useSWR(
    `vetted-gate-tree-${chainId}`,
    async () => {
      const factoryContract = ContractCSMSetVettedGateTree.connect({
        chainId,
        provider: rpcProvider,
      })
      const address = await factoryContract.vettedGate()

      const vettedGateTreeContract = CSMVettedGateTreeAbi__factory.connect(
        address,
        rpcProvider,
      )

      const treeRoot = await vettedGateTreeContract.treeRoot()
      const treeCid = await vettedGateTreeContract.treeCid()

      return {
        treeRoot: treeRoot,
        treeCid: treeCid,
      }
    },
    {
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
    },
  )
}
