import { CSMVettedGateTreeAbi__factory } from 'generated'
import { ContractCSMSetVettedGateTree } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { getLimitedJsonRpcBatchProvider } from 'modules/blockChain/utils/limitedJsonRpcBatchProvider'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useSWR } from 'modules/network/hooks/useSwr'

export const useCSMVettedGateInfo = () => {
  const { chainId } = useWeb3()
  const { getRpcUrl } = useConfig()

  return useSWR(
    `vetted-gate-tree-${chainId}`,
    async () => {
      const library = getLimitedJsonRpcBatchProvider(
        chainId,
        getRpcUrl(chainId),
      )

      const factoryContract = ContractCSMSetVettedGateTree.connect({
        chainId,
        library,
      })
      const address = await factoryContract.vettedGate()

      const vettedGateTreeContract = CSMVettedGateTreeAbi__factory.connect(
        address,
        library,
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
