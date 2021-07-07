import { fetcherGraphql } from 'modules/shared/utils/fetcherGraphql'
import { SUBGRAPH_URL } from 'modules/config'
import { RawMotionSubgraph } from '../types'
import { formatMotionDataSubgraph } from './formatMotionDataSubgraph'

type Response = { data: { motions?: RawMotionSubgraph[] } }

const getQuery = (id?: string | number) => `{
  motions(
    orderBy:id
    orderDirection: desc
    where: { status_in: ["CANCELED", "REJECTED", "ENACTED"]${
      id ? `, id: ${id}` : ''
    } }
  ) {
    id
    evmScriptFactory
    creator
    duration
    startDate
    snapshotBlock
    objectionsThreshold
    objectionsAmount
    objectionsAmountPct
    evmScriptHash
    status
  }
}`

export async function fetchMotionsArchiveList() {
  const res = await fetcherGraphql<Response>(SUBGRAPH_URL, getQuery())
  return res.data.motions?.map(formatMotionDataSubgraph)
}

export async function fetchMotionsArchiveItem(id: string | number) {
  const res = await fetcherGraphql<Response>(SUBGRAPH_URL, getQuery(id))
  const motion = res.data.motions?.[0] as RawMotionSubgraph | undefined
  return motion ? formatMotionDataSubgraph(motion) : null
}
