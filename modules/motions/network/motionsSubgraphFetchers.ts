import { RawMotionSubgraph } from '../types'
import { formatMotionDataSubgraph } from '../utils/formatMotionDataSubgraph'
import { fetcherGraphql } from 'modules/network/utils/fetcherGraphql'

type Response = { data: { motions: RawMotionSubgraph[] } }

export const getQuerySubgraphMotions = (
  arg: { skip?: number; first?: number; id?: string | number } = {},
) => `{
  motions(
    ${arg.skip !== undefined ? `skip: ${arg.skip}` : ''}
    ${arg.first !== undefined ? `first: ${arg.first}` : ''}
    orderBy: startDate
    orderDirection: desc
    where: { status_in: ["CANCELED", "REJECTED", "ENACTED"]${
      arg.id ? `, id: ${arg.id}` : ''
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
    evmScriptCalldata
    status
    enacted_at
    canceled_at
    rejected_at
  }
}`

export async function fetchMotionsSubgraphList(url: string, query: string) {
  const res = await fetcherGraphql<Response>(url, query)
  return res.data.motions.map(formatMotionDataSubgraph)
}

export async function fetchMotionsSubgraphItem(
  url: string,
  id: string | number,
) {
  const res = await fetcherGraphql<Response>(
    url,
    getQuerySubgraphMotions({ id }),
  )
  const motion = res.data.motions[0] as RawMotionSubgraph | undefined
  return motion ? formatMotionDataSubgraph(motion) : null
}
