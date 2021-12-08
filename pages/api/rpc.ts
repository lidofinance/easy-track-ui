import type { NextApiRequest, NextApiResponse } from 'next'
import { parseChainId } from 'modules/blockChain/chains'
import { getRpcJsonUrls } from 'modules/blockChain/utils/getRpcUrls'
import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'
import { logger } from 'modules/shared/utils/log'
import { Counter, register } from 'prom-client'
import { METRICS_PREFIX } from 'modules/config'

register.clear()

export const rpcRequests = new Counter({
  name: METRICS_PREFIX + 'proxy_rpc_requests',
  help: 'Total, successful and failed requests to proxy rpc',
  labelNames: ['total', 'failed', 'success'] as const,
})

export default async function rpc(req: NextApiRequest, res: NextApiResponse) {
  rpcRequests.inc({ total: 1 })

  const requestInfo = {
    type: 'API request',
    path: 'rpc',
    body: req.body,
    query: req.query,
    method: req.method,
    stage: 'INCOMING',
  }

  logger.info({
    ...requestInfo,
    message: 'Incoming request to api/rpc',
  })

  try {
    const chainId = parseChainId(String(req.query.chainId))

    const urls = getRpcJsonUrls(chainId)
    const requested = await fetchWithFallback(urls, {
      method: 'POST',
      // Next by default parses our body for us, we don't want that here
      body: JSON.stringify(req.body),
    })

    const responded = await requested.json()

    res.status(requested.status).json(responded)

    rpcRequests.inc({ success: 1 })
    logger.info({
      ...requestInfo,
      message: 'Request to api/rpc successfully fullfilled',
      stage: 'FULFILLED',
    })
  } catch (error) {
    rpcRequests.inc({ failed: 1 })
    logger.error(
      error instanceof Error
        ? {
            ...error,
            ...requestInfo,
            message: error.message,
            stage: 'FAILED',
          }
        : {
            ...requestInfo,
            error,
            message: 'Something went wrong',
          },
    )
    res.status(500).send({ error: 'Something went wrong!' })
  }
}
