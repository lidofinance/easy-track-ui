import { useCallback } from 'react'
import { useFetcherSubgraph } from 'modules/network/hooks/useFetcherSubgraph'
import { RawMotionSubgraph } from '../types'
import { formatMotionDataSubgraph } from '../utils/formatMotionDataSubgraph'

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
    evmScriptCalldata
    status
    enacted_at
    canceled_at
    rejected_at
  }
}`

export function useFetchMotionsSubgraphList() {
  const fetchSubgraph = useFetcherSubgraph()
  return useCallback(
    async (query: string) => {
      const res = await fetchSubgraph<Response>(query)
      return res.data.motions.map(formatMotionDataSubgraph)
    },
    [fetchSubgraph],
  )
}

export function useFetchMotionsSubgraphItem() {
  const fetchSubgraph = useFetcherSubgraph()
  return useCallback(
    async (id: string | number) => {
      const res = await fetchSubgraph<Response>(getQuerySubgraphMotions({ id }))
      const motion = res.data.motions[0] as RawMotionSubgraph | undefined
      return motion ? formatMotionDataSubgraph(motion) : null
    },
    [fetchSubgraph],
  )
}
