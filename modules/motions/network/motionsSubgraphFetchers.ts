import { RawMotionSubgraph } from '../types'
import { formatMotionDataSubgraph } from '../utils/formatMotionDataSubgraph'
import { fetcherGraphql } from 'modules/network/utils/fetcherGraphql'
import { CHAINS } from '@lido-sdk/constants'

type Response = {
  data: { motions: RawMotionSubgraph[] }
  errors?: { message: string }[]
}

export const getQuerySubgraphMotions = (
  arg: { skip?: number; first?: number; id?: string | number } = {},
) => `{
  motions(
    ${arg.skip !== undefined ? `skip: ${arg.skip}` : ''}
    ${arg.first !== undefined ? `first: ${arg.first}` : ''}
    orderBy: startDate
    orderDirection: desc
    where: ${
      arg.id
        ? `{ id: ${arg.id} }`
        : `{ status_in: ["CANCELED", "REJECTED", "ENACTED"] }`
    }
  ) {
    id
    evmScriptFactory
    creator
    duration
    startDate
    snapshotBlock
    objectionsThreshold
    objectionsAmount
    evmScriptHash
    evmScriptCalldata
    status
    enacted_at
    canceled_at
    rejected_at
  }
}`

const getMotionsScriptsQuery = (motionIds: (string | number)[]) => `{
  motions(where: { id_in: [${motionIds.join(', ')}] }) {
    id
    evmScriptCalldata
  }
}`

export async function fetchMotionsSubgraphList(chainId: CHAINS, query: string) {
  const res = await fetcherGraphql<Response>(chainId, query)
  if (res.errors) throw Error(res.errors[0].message)
  return res.data.motions.map(formatMotionDataSubgraph)
}

export async function fetchMotionsSubgraphItem(
  chainId: CHAINS,
  id: string | number,
) {
  const res = await fetcherGraphql<Response>(
    chainId,
    getQuerySubgraphMotions({ id }),
  )
  const motion = res.data.motions[0] as RawMotionSubgraph | undefined
  return motion ? formatMotionDataSubgraph(motion) : null
}

type MotionsScriptsResponse = {
  data: { motions: { id: string; evmScriptCalldata: string }[] }
  errors?: { message: string }[]
}

export async function fetchMotionsScriptsSubgraph(
  chainId: CHAINS,
  motionIds: (string | number)[],
) {
  const res = await fetcherGraphql<MotionsScriptsResponse>(
    chainId,
    getMotionsScriptsQuery(motionIds),
  )

  return res.data.motions.reduce((acc, motion) => {
    acc[motion.id] = motion.evmScriptCalldata
    return acc
  }, {} as Record<string, string>)
}
