import { useCallback } from 'react'
import { fetcherGraphql } from '../utils/fetcherGraphql'
import { useSubgraphUrl } from './useSubgraphUrl'

export function useFetcherSubgraph() {
  const subgraphUrl = useSubgraphUrl()
  return useCallback(
    <T>(query: string) => fetcherGraphql<T>(subgraphUrl, query),
    [subgraphUrl],
  )
}
