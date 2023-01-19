import getConfig from 'next/config'
import type { NextApiRequest, NextApiResponse } from 'next'
import { parseChainId } from 'modules/blockChain/chains'
import { getAlchemyRPCUrl, getInfuraRPCUrl } from '@lido-sdk/fetch'

import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'
import { logger } from 'modules/shared/utils/log'
import clone from 'just-clone'

const { serverRuntimeConfig } = getConfig()
const { infuraApiKey, alchemyApiKey } = serverRuntimeConfig

export default async function rpc(req: NextApiRequest, res: NextApiResponse) {
  const requestInfo = {
    type: 'API request',
    path: 'rpc',
    body: clone(req.body),
    query: clone(req.query),
    method: req.method,
    stage: 'INCOMING',
  }

  logger.info('Incoming request to api/rpc', requestInfo)

  try {
    const chainId = parseChainId(String(req.query.chainId))

    const urls = [
      alchemyApiKey ? getAlchemyRPCUrl(chainId, alchemyApiKey) : '',
      infuraApiKey ? getInfuraRPCUrl(chainId, infuraApiKey) : '',
    ].filter(Boolean)

    const requested = await fetchWithFallback(urls, chainId, {
      method: 'POST',
      // Next by default parses our body for us, we don't want that here
      body: JSON.stringify(req.body),
    })

    const responded = await requested.json()

    res.status(requested.status).json(responded)

    logger.info('Request to api/rpc successfully fullfilled', {
      ...requestInfo,
      stage: 'FULFILLED',
    })
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : 'Something went wrong',
      error,
    )
    res.status(500).send({ error: 'Something went wrong!' })
  }
}
