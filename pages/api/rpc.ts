import type { NextApiRequest, NextApiResponse } from 'next'
import { parseChainId } from 'modules/blockChain/chains'
import { getRpcJsonUrls } from 'modules/blockChain/utils/getRpcUrls'
import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'
import { logger } from 'modules/shared/utils/log'
import { Gauge, register } from 'prom-client'
import { METRICS_PREFIX } from 'modules/config'

register.clear()

export const totalRpcRequests = new Gauge({
  name: METRICS_PREFIX + 'total_rpc_requests',
  help: 'Number of total requests sent to api/rpc',
})

export const successfulRpcRequests = new Gauge({
  name: METRICS_PREFIX + 'successful_rpc_requests',
  help: 'Number of successful requests sent to api/rpc',
})

export const failedRpcRequests = new Gauge({
  name: METRICS_PREFIX + 'failed_rpc_requests',
  help: 'Number of failed requests sent to api/rpc',
})

export default async function rpc(req: NextApiRequest, res: NextApiResponse) {
  totalRpcRequests.inc()
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
    successfulRpcRequests.inc()
  } catch (error) {
    failedRpcRequests.inc()
    logger.error(error)
    res.status(500).send({ error: 'Something went wrong!' })
  }
}
