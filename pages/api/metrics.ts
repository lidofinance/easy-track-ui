import { NextApiRequest, NextApiResponse } from 'next'
import { register, collectDefaultMetrics, Gauge, Histogram } from 'prom-client'
import buildInfoJson from 'build-info.json'
import { getRpcJsonUrls } from 'modules/blockChain/utils/getRpcUrls'
import getConfig from 'next/config'
import { Chains } from 'modules/blockChain/chains'
import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'
import { getAddressList } from 'modules/config/utils/getAddressList'

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

export const collectChainConfig = () => {
  const chainConfig = new Gauge({
    name: METRICS_PREFIX + 'chain_config',
    help: 'Default network and supported networks',
    labelNames: ['default_chain', 'supported_chains'],
  })

  chainConfig
    .labels(
      publicRuntimeConfig.defaultChain,
      publicRuntimeConfig.supportedChains,
    )
    .set(1)
}

export const collectContractConfigForChain = (chainId: Chains) => {
  const contractNames = getAddressList(chainId).map(c => c.contractName)
  const contractAddrs = getAddressList(chainId).map(c => c.address)

  const contractConfig = new Gauge({
    name: METRICS_PREFIX + `contract_config_${chainId}`,
    help: `Contract config for chain ${chainId}`,
    labelNames: contractNames,
  })

  contractConfig.labels(...contractAddrs).set(1)
}

const collectContractConfig = () => {
  const supportedChains = publicRuntimeConfig.supportedChains
    .split(',')
    .map(Number)

  supportedChains.forEach(collectContractConfigForChain)
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
  collectChainConfig()
  collectContractConfig()
  await timeEthereum()
  collectDefaultMetrics({ prefix: METRICS_PREFIX })

  res.setHeader('Content-type', register.contentType)
  const metrics = await register.metrics()
  res.send(metrics)
}
