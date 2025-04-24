import type { NextApiRequest, NextApiResponse } from 'next'
import clone from 'just-clone'
import getConfig from 'next/config'
import { CHAINS } from '@lido-sdk/constants'
import { parseChainId } from 'modules/blockChain/chains'

const { serverRuntimeConfig } = getConfig()
export const SUBGRAPH_URL: Partial<Record<CHAINS, string>> = {
  [CHAINS.Mainnet]: serverRuntimeConfig.subgraphMainnet,
  [CHAINS.Goerli]: serverRuntimeConfig.subgraphGoerli,
  [CHAINS.Holesky]: serverRuntimeConfig.subgraphHolesky,
  [CHAINS.Hoodi]: serverRuntimeConfig.subgraphHoodi,
} as const

export default async function subgraph(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const parsedBody = req.body && JSON.parse(req.body)
  const requestInfo = {
    type: 'API request',
    path: 'subgraph',
    body: clone(parsedBody),
    query: clone(req.query),
    method: req.method,
    stage: 'INCOMING',
  }

  if (!parsedBody.query) {
    const status = 'Error: query is empty'
    console.error(status, requestInfo)
    res.status(400).json({ status })
    return
  }

  const chainId = parseChainId(String(req.query.chainId))
  const url = SUBGRAPH_URL[chainId]

  if (!url) {
    const status = 'Error: subgraph chain is not supported'
    console.error(status, requestInfo)
    res.status(400).json({ status })
    return
  }

  try {
    const requested = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: req.body,
    })

    if (!requested.ok) {
      const errorMessage = await requested.text()
      res.status(requested.status).send(errorMessage)
      return
    }

    const responded = await requested.json()
    res.status(requested.status).json(responded)
    console.info('Request to api/subgraph successfully fulfilled', {
      ...requestInfo,
      stage: 'FULFILLED',
    })
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'Something went wrong',
      {
        error,
        ...requestInfo,
      },
    )
    res.status(500).send({ error: 'Something went wrong!' })
  }
}
