import { NextApiRequest, NextApiResponse } from 'next'
import { register, collectDefaultMetrics, Gauge, Histogram } from 'prom-client'
import buildInfoJson from 'build-info.json'
import { getRpcJsonUrls } from 'modules/blockChain/utils/getRpcUrls'
import getConfig from 'next/config'
import { Chains } from 'modules/blockChain/chains'
import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'

const { publicRuntimeConfig } = getConfig()
const defaultChain = +publicRuntimeConfig.defaultChain as Chains

const METRICS_PREFIX = 'easy_track_ui_'

export const recordBuildInfo = () => {
  const buildInfo = new Gauge({
    name: METRICS_PREFIX + 'build_info',
    help: 'Build information',
    labelNames: ['version', 'commit', 'branch'],
  })

  buildInfo
    .labels(buildInfoJson.version, buildInfoJson.commit, buildInfoJson.branch)
    .set(1)
}

const timeEthereum = async () => {
  const ethereumResponseTime = new Histogram({
    name: METRICS_PREFIX + 'ethereum_response_time',
    help: 'Third-party Ethereum provider response time',
    buckets: [0.1, 1, 5, 10, 60],
  })

  const urls = getRpcJsonUrls(defaultChain)

  const end = ethereumResponseTime.startTimer()

  await fetchWithFallback(urls, {
    method: 'POST',
    body: JSON.stringify({
      method: 'eth_chainId',
      params: [],
      id: 1,
      jsonrpc: '2.0',
    }),
  })

  end()
}

export default async function m(req: NextApiRequest, res: NextApiResponse) {
  register.clear()
  recordBuildInfo()
  await timeEthereum()
  collectDefaultMetrics({ prefix: METRICS_PREFIX })

  res.setHeader('Content-type', register.contentType)
  const metrics = await register.metrics()
  res.send(metrics)
}
