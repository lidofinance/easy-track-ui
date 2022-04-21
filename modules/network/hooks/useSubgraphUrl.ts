import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { SUBGRAPH_URL } from '../networkConfig'

export function useSubgraphUrl() {
  const { chainId } = useWeb3()
  return SUBGRAPH_URL[chainId]
}
