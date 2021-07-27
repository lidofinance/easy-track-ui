import { fetcherGraphql } from './fetcherGraphql'
import { SUBGRAPH_URL } from 'modules/config'

export function fetcherSubgraph<T>(query: string) {
  return fetcherGraphql<T>(SUBGRAPH_URL, query)
}
