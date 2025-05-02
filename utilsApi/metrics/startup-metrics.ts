import { Gauge, type Registry } from 'prom-client'
import { collectStartupMetrics as collectBuildInfoMetrics } from '@lidofinance/api-metrics'

import buildInfoJson from 'build-info.json'
import { openKeys } from 'scripts/log-environment-variables.mjs'
import { getRPCChecks } from 'scripts/startup-checks/rpc.mjs'

import { METRICS_PREFIX } from './constants'

import { StartupChecksRPCMetrics } from './startup-checks'
import getConfig from 'next/config'

const collectStartupChecksRPCMetrics = async (
  registry: Registry,
): Promise<void> => {
  const rpcMetrics = new StartupChecksRPCMetrics(registry)
  try {
    const rpcChecksResults = (await getRPCChecks()) || []

    rpcChecksResults.forEach(
      (_check: { domain: string; chainId: number; success: boolean }) => {
        rpcMetrics.requestStatusGauge
          .labels({ rpc_domain: _check.domain, chain_id: _check.chainId })
          .set(Number(+!_check.success))
      },
    )
  } catch (error) {
    console.error(
      `[collectStartupChecksRPCMetrics] Error collecting RPC metrics: ${error}`,
    )
    rpcMetrics.requestStatusGauge
      .labels({ rpc_domain: 'BROKEN_URL' }) // false as string, chainId is not important here
      .inc(1)
  }
}

const collectEnvInfoMetrics = (registry: Registry): void => {
  const labelPairs = openKeys.map(key => ({
    name: key,
    value: process.env[key] ?? '',
  }))

  const envInfo = new Gauge({
    name: METRICS_PREFIX + 'env_info',
    help: 'Environment variables of the current runtime',
    labelNames: labelPairs.map(pair => pair.name),
    registers: [registry],
  })
  envInfo.labels(...labelPairs.map(pair => pair.value)).set(1)
}

export const collectStartupMetrics = async (
  registry: Registry,
): Promise<void> => {
  // conflicts with HMR
  collectEnvInfoMetrics(registry)

  const { publicRuntimeConfig } = getConfig()
  const { defaultChain, supportedChains } = publicRuntimeConfig
  collectBuildInfoMetrics({
    prefix: METRICS_PREFIX,
    registry: registry,
    defaultChain: defaultChain,
    supportedChains: supportedChains.split().map((chain: number) => `${chain}`),
    version: buildInfoJson.commit,
    commit: buildInfoJson.commit,
    branch: buildInfoJson.branch,
  })

  await collectStartupChecksRPCMetrics(registry)
}
