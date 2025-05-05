import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper'
import { TrackedFetchRPC, trackedFetchRpcFactory } from '@lidofinance/api-rpc'
import { rpcFactory } from '@lidofinance/next-pages'
import { secretConfig } from 'config'
import { API_ROUTES } from 'constants/api'
import {
  rateLimit,
  responseTimeMetric,
  defaultErrorHandler,
  requestAddressMetric,
  httpMethodGuard,
  HttpMethod,
} from 'utilsApi'
import {
  METRIC_CONTRACT_ADDRESSES,
  METRIC_CONTRACT_EVENT_ADDRESSES,
} from 'utilsApi/contractAddressesMetricsMap'
import { Metrics, METRICS_PREFIX } from 'utilsApi/metrics'
import getConfig from 'next/config'
import { CHAINS } from '@lido-sdk/constants'
import {
  Stonks,
  DAI,
  USDC,
  USDT,
  STETH,
} from '../../modules/blockChain/contractAddresses'
import {
  MAX_BLOCK_LIMIT,
  MAX_PROVIDER_BATCH,
  MAX_RESPONSE_SIZE,
} from '../../modules/blockChain/constants'
import { Address } from 'wagmi'

const { publicRuntimeConfig } = getConfig()
const { defaultChain } = publicRuntimeConfig

const allowedCallAddresses: Record<string, string[]> = Object.entries(
  METRIC_CONTRACT_ADDRESSES,
).reduce((acc, [chainId, addresses]) => {
  const tokens = [DAI, USDC, USDT, STETH].map(
    (stable: Partial<Record<CHAINS, string>>) =>
      // @ts-ignore
      stable[chainId]?.toLowerCase(),
  )

  acc[chainId] = [
    ...Object.keys(addresses),
    // @ts-ignore
    ...(Stonks[chainId].map((address: Address) =>
      address.toLowerCase(),
    ) as string[]),
    ...tokens,
  ].filter(tokenAddress => tokenAddress !== undefined)

  return acc
}, {} as Record<string, string[]>)

const allowedLogsAddresses: Record<string, string[]> = Object.entries(
  METRIC_CONTRACT_EVENT_ADDRESSES,
).reduce((acc, [chainId, addresses]) => {
  acc[chainId] = [
    ...Object.keys(addresses),
    // TODO: discuss
    // @ts-ignore
    ...(Stonks[chainId].map((address: Address) =>
      address.toLowerCase(),
    ) as string[]),
  ]
  return acc
}, {} as Record<string, string[]>)

const allowedRPCMethods = [
  'test',
  'eth_call',
  'eth_gasPrice',
  'eth_getCode',
  'eth_estimateGas',
  'eth_getBlockByNumber',
  'eth_feeHistory',
  'eth_maxPriorityFeePerGas',
  'eth_getBalance',
  'eth_blockNumber',
  'eth_getTransactionByHash',
  'eth_getTransactionReceipt',
  'eth_getTransactionCount',
  'eth_sendRawTransaction',
  'eth_getLogs',
  'eth_chainId',
  'net_version',
]

const rpc = rpcFactory({
  fetchRPC: trackedFetchRpcFactory({
    prefix: METRICS_PREFIX,
    registry: Metrics.registry,
  }) as TrackedFetchRPC,
  metrics: {
    prefix: METRICS_PREFIX,
    registry: Metrics.registry,
  },
  defaultChain: `${defaultChain}`,
  providers: {
    [CHAINS.Mainnet]: secretConfig.rpcUrls_1,
    [CHAINS.Goerli]: secretConfig.rpcUrls_5,
    [CHAINS.Holesky]: secretConfig.rpcUrls_17000,
    [CHAINS.Hoodi]: secretConfig.rpcUrls_560048,
  },
  validation: {
    allowedRPCMethods,
    allowedCallAddresses,
    allowedLogsAddresses,
    maxBatchCount: MAX_PROVIDER_BATCH,
    blockEmptyAddressGetLogs: true,
    maxGetLogsRange: MAX_BLOCK_LIMIT, // limits the size of historical queries
    maxResponseSize: MAX_RESPONSE_SIZE, // limits max response size
  },
})

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.RPC),
  requestAddressMetric(Metrics.request.ethCallToAddress),
  defaultErrorHandler,
])(rpc)
