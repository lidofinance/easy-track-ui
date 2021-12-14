import { Gauge, Histogram } from 'prom-client'
import buildInfoJson from 'build-info.json'
import getConfig from 'next/config'
import { getAlchemyRPCUrl, getInfuraRPCUrl } from '@lido-sdk/fetch'
import { METRICS_PREFIX } from 'modules/config'

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()
const { defaultChain, supportedChains } = publicRuntimeConfig
const {
  infuraApiKey,
  alchemyApiKey,
  cspTrustedHosts,
  cspReportOnly,
  cspReportUri,
} = serverRuntimeConfig

// BUILD_INFO

const buildInfo = new Gauge({
  name: METRICS_PREFIX + 'build_info',
  help: 'Build information',
  labelNames: ['version', 'commit', 'branch'],
})

export const collectBuildInfo = (): void => {
  const { version, commit, branch } = buildInfoJson

  buildInfo.labels(version, commit, branch).set(1)
}

// CSP CONFIG
const cspConfig = new Gauge({
  name: METRICS_PREFIX + 'csp_config_info',
  help: 'Content-Security Policy Configuration',
  labelNames: ['trusted_hosts', 'report_only', 'report_uri'],
})

export const collectCspConfig = (): void => {
  cspConfig.labels(cspTrustedHosts, cspReportOnly, cspReportUri).set(1)
}

// CHAIN CONFIG
const chainConfig = new Gauge({
  name: METRICS_PREFIX + 'chain_config_info',
  help: 'Default network and supported networks',
  labelNames: ['default_chain', 'supported_chains'],
})

export const collectChainConfig = (): void => {
  chainConfig.labels(defaultChain, supportedChains).set(1)
}

// INFURA RESPONSE

export const infuraResponseTime = new Histogram({
  name: METRICS_PREFIX + 'infura_response_time_seconds',
  help: 'Infura response time',
  buckets: [0, 0.05, 0.1, 0.5, 1, 5, 10],
  labelNames: ['status'],
})

export const timeInfura = async (): Promise<void> => {
  if (!infuraApiKey) {
    return infuraResponseTime.observe(0)
  }

  const url = getInfuraRPCUrl(+defaultChain, infuraApiKey)

  const end = infuraResponseTime.startTimer()

  await fetch(url, {
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

// ALCHEMY RESPONSE

export const alchemyResponseTime = new Histogram({
  name: METRICS_PREFIX + 'alchemy_response_time_seconds',
  help: 'Alchemy response time',
  buckets: [0, 0.05, 0.1, 0.5, 1, 5, 10],
  labelNames: ['status'],
})

export const timeAlchemy = async (): Promise<void> => {
  if (!alchemyApiKey) {
    return alchemyResponseTime.observe(0)
  }

  const url = getAlchemyRPCUrl(+defaultChain, alchemyApiKey)

  const end = alchemyResponseTime.startTimer()

  await fetch(url, {
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
