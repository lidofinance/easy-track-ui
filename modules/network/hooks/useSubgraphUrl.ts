import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { SUBGRAPH_URL } from '../networkConfig'

export function useSubgraphUrl() {
  const chainId = useCurrentChain()
  return SUBGRAPH_URL[chainId]
}
