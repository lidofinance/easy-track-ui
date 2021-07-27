import { fetcherSubgraph } from 'modules/shared/utils/fetcherSubgraph'
import { RawMotionSubgraph } from '../types'
import { formatMotionDataSubgraph } from './formatMotionDataSubgraph'

type Response = { data: { motions: RawMotionSubgraph[] } }

export const getQuerySubgraphMotions = (
  arg: { skip?: number; first?: number; id?: string | number } = {},
) => `{
  motions(
    ${arg.skip !== undefined ? `skip: ${arg.skip}` : ''}
    ${arg.first !== undefined ? `first: ${arg.first}` : ''}
    orderBy:id
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
    status
  }
}`

export async function fetchMotionsSubgraphList(query: string) {
  const res = await fetcherSubgraph<Response>(query)
  return res.data.motions.map(formatMotionDataSubgraph)
}

export async function fetchMotionsSubgraphItem(id: string | number) {
  const res = await fetcherSubgraph<Response>(getQuerySubgraphMotions({ id }))
  const motion = res.data.motions[0] as RawMotionSubgraph | undefined
  return motion ? formatMotionDataSubgraph(motion) : null
}
