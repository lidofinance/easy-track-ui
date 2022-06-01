import { CHAINS } from '@lido-sdk/constants'
import { fetcherStandard } from './fetcherStandard'
import { SUBGRAPH_ENDPOINT } from 'modules/config'

export function fetcherGraphql<T>(chainId: CHAINS, query: string) {
  return fetcherStandard<T>(`${SUBGRAPH_ENDPOINT}?chainId=${chainId}`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
}
