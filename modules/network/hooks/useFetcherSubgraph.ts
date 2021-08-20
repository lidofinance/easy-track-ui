import { useCallback } from 'react'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { fetcherGraphql } from '../utils/fetcherGraphql'
import { SUBGRAPH_URL } from '../networkConfig'

export function useFetcherSubgraph() {
  const chainId = useCurrentChain()
  return useCallback(
    <T>(query: string) => fetcherGraphql<T>(SUBGRAPH_URL[chainId], query),
    [chainId],
  )
}
