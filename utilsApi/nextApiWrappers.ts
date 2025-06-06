import type { Histogram, Counter } from 'prom-client'
import { getStatusLabel } from '@lidofinance/api-metrics'
import { rateLimitWrapper } from '@lidofinance/next-ip-rate-limit'
import {
  RequestWrapper,
  wrapRequest as wrapNextRequest,
  cacheControl,
  DefaultErrorHandlerArgs,
  DEFAULT_API_ERROR_MESSAGE,
} from '@lidofinance/next-api-wrapper'

import {
  METRIC_CONTRACT_ADDRESSES,
  getMetricContractAbi,
} from './contractAddressesMetricsMap'
import { CHAINS } from '@lido-sdk/constants'
import { secretConfig } from '../config'
import { CACHE_DEFAULT_HEADERS } from '../config/groups/cache'
import { Abi } from 'abitype'
import { getAddress, keccak256 } from 'ethers/lib/utils'

// Replacement for the toFunctionSelector from Viem, since we can't use it with the current setup
const toFunctionSelector = (functionSignature: string): string => {
  if (typeof functionSignature !== 'string') {
    throw new Error('Function signature must be a string')
  }

  if (!functionSignature.includes('(') || !functionSignature.includes(')')) {
    throw new Error(
      `Invalid function signature: "${functionSignature}". Expected format: "functionName(paramType1,paramType2)"`,
    )
  }

  const hash = keccak256(Buffer.from(functionSignature))
  const selector = hash.slice(0, 10) // Extract first 4 bytes (10 characters including "0x")
  return selector
}

export enum HttpMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
  PATCH = 'PATCH',
}

export const getFunctionNameFromAbi = (
  abi: Abi,
  methodEncoded: string,
): string | null => {
  for (const item of abi) {
    if (item.type === 'function') {
      try {
        const signature = `${item.name}(${item.inputs
          .map((i: any) => i.type)
          .join(',')})`

        const selector = toFunctionSelector(signature)
        if (selector === methodEncoded) {
          return item.name
        }
      } catch (error) {
        console.warn(`Failed to process ABI item: ${item.name}`, error)
      }
    }
  }
  return null
}

export const extractErrorMessage = (
  error: unknown,
  defaultMessage?: string,
): string => {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  return defaultMessage ?? DEFAULT_API_ERROR_MESSAGE
}

export type CorsWrapperType = {
  origin?: string[]
  methods?: HttpMethod[]
  allowedHeaders?: string[]
  credentials?: boolean
}

export const cors =
  ({
    origin = ['*'],
    methods = [HttpMethod.GET],
    allowedHeaders = ['*'],
    credentials = false,
  }: CorsWrapperType): RequestWrapper =>
  async (req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!req || !req.method) {
      res.status(405)
      throw new Error('Not HTTP method provided')
    }

    res.setHeader('Access-Control-Allow-Credentials', String(credentials))
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', methods.join(', '))
    res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '))

    if (req.method === HttpMethod.OPTIONS) {
      // In preflight just need return a CORS headers
      res.status(200).end()
      return
    }

    await next?.(req, res, next)
  }

export const httpMethodGuard =
  (methodAllowList: HttpMethod[]): RequestWrapper =>
  async (req, res, next) => {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      !req ||
      !req.method ||
      !Object.values(methodAllowList).includes(req.method as HttpMethod)
    ) {
      // allow OPTIONS to pass trough but still add Allow header
      res.setHeader('Allow', methodAllowList.join(', '))
      if (req.method !== HttpMethod.OPTIONS) {
        res.status(405)
        throw new Error(`You can use only: ${methodAllowList.toString()}`)
      }
    }

    await next?.(req, res, next)
  }

export const responseTimeMetric =
  (metrics: Histogram<string>, route: string): RequestWrapper =>
  async (req, res, next) => {
    let status = '2xx'
    const endMetric = metrics.startTimer({ route })

    try {
      await next?.(req, res, next)
      status = getStatusLabel(res.statusCode)
    } catch (error) {
      status = getStatusLabel(res.statusCode)
      // throw error up the stack
      throw error
    } finally {
      endMetric({ status })
    }
  }

const parseRefererUrl = (referer: string) => {
  if (!referer) return null
  try {
    const url = new URL(referer)
    return `${url.origin}${url.pathname}`
  } catch (error) {
    return null
  }
}

const collectRequestAddressMetric = async ({
  calls,
  referer,
  chainId,
  metrics,
}: {
  calls: any[]
  referer: string
  chainId: CHAINS
  metrics: Counter<string>
  // eslint-disable-next-line @typescript-eslint/require-await
}) => {
  const refererUrlParsed = parseRefererUrl(referer)
  calls.forEach((call: any) => {
    if (
      typeof call === 'object' &&
      call.method === 'eth_call' &&
      call.params[0].to
    ) {
      const { to, data } = call.params[0]
      const address = getAddress(to)
      const contractName = METRIC_CONTRACT_ADDRESSES[chainId][address]
      const methodEncoded = data?.slice(0, 10) // `0x` and 8 next symbols

      let methodDecoded = 'N/A'
      if (!methodEncoded || methodEncoded.length !== 10) {
        console.warn(`Invalid methodEncoded: ${methodEncoded}`)
      } else {
        try {
          if (contractName) {
            const abi = getMetricContractAbi(contractName)
            if (!abi) {
              console.warn(`ABI not found for contract: ${contractName}`)
            } else {
              const functionName = getFunctionNameFromAbi(abi, methodEncoded)
              methodDecoded = functionName || 'Unknown Function'
            }
          }
        } catch (error) {
          console.warn(
            `[collectRequestAddressMetric] failed to decode ${methodEncoded} method for ${contractName}: ${error}`,
          )
        }
      }

      metrics
        .labels({
          address,
          referer: refererUrlParsed || 'N/A',
          contractName: contractName || 'N/A',
          methodEncoded: methodEncoded || 'N/A',
          methodDecoded: methodDecoded || 'N/A',
        })
        .inc(1)
    }
  })
}

export const requestAddressMetric =
  (metrics: Counter<string>): RequestWrapper =>
  async (req, res, next) => {
    const referer = req.headers.referer as string
    const chainId = req.query.chainId as unknown as CHAINS

    if (req.body) {
      void collectRequestAddressMetric({
        calls: Array.isArray(req.body) ? req.body : [req.body],
        referer,
        chainId,
        metrics,
      }).catch(console.error)
    }

    await next?.(req, res, next)
  }

export const rateLimit = rateLimitWrapper({
  rateLimit: secretConfig.rateLimit,
  rateLimitTimeFrame: secretConfig.rateLimitTimeFrame,
})

export const nextDefaultErrorHandler =
  (args?: DefaultErrorHandlerArgs): RequestWrapper =>
  async (req, res, next) => {
    const { errorMessage = DEFAULT_API_ERROR_MESSAGE } = args || {}
    try {
      await next?.(req, res, next)
    } catch (error) {
      if (res.headersSent) {
        console.error(
          '[nextDefaultErrorHandler] error after headers sent:',
          extractErrorMessage(error, errorMessage),
        )
        return
      }

      const isInnerError = res.statusCode === 200
      const status = isInnerError ? 500 : res.statusCode || 500

      if (error instanceof Error) {
        const serverError = 'status' in error && (error.status as number)
        console.error(extractErrorMessage(error, errorMessage))
        res
          .status(serverError || status)
          .json({ message: extractErrorMessage(error, errorMessage) })
        return
      }

      res.status(status).json({ message: errorMessage })
    }
  }

type sunsetByArgs = {
  replacementLink?: string
  sunsetTimestamp: number
}

export const sunsetBy =
  ({ replacementLink, sunsetTimestamp }: sunsetByArgs): RequestWrapper =>
  async (req, res, next) => {
    console.warn(`Request to deprecated endpoint: ${req.url}`)
    const shouldDisable = Date.now() > sunsetTimestamp

    if (shouldDisable) {
      if (replacementLink) {
        res.setHeader('Location', replacementLink)
        // Permanent Redirect
        res.status(301)
      } else {
        // Gone
        res.status(410)
      }
      res.end()
    } else {
      const sunsetDate = new Date(sunsetTimestamp).toUTCString()
      res.status(299)
      res.setHeader(
        'Warning',
        `299 - "this resource will be sunset by ${sunsetDate}"`,
      )
      res.setHeader('Deprecation', 'true')
      res.setHeader('Sunset', sunsetDate)
      if (replacementLink) {
        res.setHeader('Link', `${replacementLink}; rel="alternate"`)
      }
      await next?.(req, res, next)
    }
  }

export const defaultErrorHandler = nextDefaultErrorHandler()

// ready wrapper types

export const errorAndCacheDefaultWrappers = [
  cacheControl({
    headers: CACHE_DEFAULT_HEADERS,
  }),
  defaultErrorHandler,
]
export const defaultErrorAndCacheWrapper = wrapNextRequest([
  ...errorAndCacheDefaultWrappers,
])
