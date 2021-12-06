import { NextApiRequest, NextApiResponse } from 'next'
import { register, collectDefaultMetrics, Gauge, Histogram } from 'prom-client'
import buildInfoJson from 'build-info.json'
import {
  getAlchemyRpcUrl,
  getInfuraRpcUrl,
} from 'modules/blockChain/utils/getRpcUrls'
import getConfig from 'next/config'
import { Chains } from 'modules/blockChain/chains'
import { getAddressList } from 'modules/config/utils/getAddressList'
import { rpcRequests } from './rpc'
import { METRICS_PREFIX } from 'modules/config'

const { serverRuntimeConfig } = getConfig()
const { infuraApiKey, alchemyApiKey } = serverRuntimeConfig

const { publicRuntimeConfig } = getConfig()
const defaultChain = +publicRuntimeConfig.defaultChain as Chains

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
    name: METRICS_PREFIX + 'chain_config_info',
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
    name: METRICS_PREFIX + `contract_config_${chainId}_info`,
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

const timeInfura = async () => {
  const ethereumResponseTime = new Histogram({
    name: METRICS_PREFIX + 'infura_response_time_seconds',
    help: 'Infura response time',
    buckets: [0.1, 1, 5, 10, 60],
    labelNames: ['status'],
  })

  if (!infuraApiKey) {
    return
  }

  const url = getInfuraRpcUrl(defaultChain)

  const end = ethereumResponseTime.startTimer()

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      method: 'eth_chainId',
      params: [],
      id: 1,
      jsonrpc: '2.0',
    }),
  })

  ethereumResponseTime.labels(String(response.status))

  end()
}

const timeAlchemy = async () => {
  const ethereumResponseTime = new Histogram({
    name: METRICS_PREFIX + 'alchemy_response_time_seconds',
    help: 'Alchemy response time',
    buckets: [0.1, 1, 5, 10, 60],
    labelNames: ['status'],
  })

  if (!alchemyApiKey) {
    return ethereumResponseTime.observe(0)
  }

  const url = getAlchemyRpcUrl(defaultChain)

  const end = ethereumResponseTime.startTimer()

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      method: 'eth_chainId',
      params: [],
      id: 1,
      jsonrpc: '2.0',
    }),
  })

  ethereumResponseTime.labels(String(response.status))

  end()
}

export default async function m(req: NextApiRequest, res: NextApiResponse) {
  register.clear()
  register.registerMetric(rpcRequests)
  recordBuildInfo()
  collectChainConfig()
  collectContractConfig()
  await timeInfura()
  await timeAlchemy()
  collectDefaultMetrics({ prefix: METRICS_PREFIX })

  res.setHeader('Content-type', register.contentType)
  const metrics = await register.metrics()
  res.send(metrics)
}
