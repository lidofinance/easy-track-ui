import { type Modify, toBoolean } from './helpers'
import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()

export type SecretConfigType = Modify<
  typeof serverRuntimeConfig,
  {
    supportedChains: string[]

    rpcUrls_1: [string, ...string[]]
    rpcUrls_5: [string, ...string[]]
    rpcUrls_17000: [string, ...string[]]
    // Dynamic keys like rpcUrls_<number>
    // eslint-disable-next-line @typescript-eslint/member-ordering
    [key: `rpcUrls_${number}`]: string[]

    cspReportOnly: boolean

    rateLimit: number
    rateLimitTimeFrame: number
  }
>

// 'getSecretConfig()' is required for the backend side.
// We can't merge with 'getPreConfig()' because we want to split responsibility
//
// Also you can note that 'getSecretConfig' is just a proxy for 'serverRuntimeConfig'
// because we want similar approach with 'getConfig'
export const getSecretConfig = (): SecretConfigType => {
  return {
    ...serverRuntimeConfig,

    // Hack: in the current implementation we can treat an empty array as a "tuple" (conditionally)
    rpcUrls_1: (serverRuntimeConfig.rpcUrls_1 ?? []) as [string, ...string[]],
    rpcUrls_5: (serverRuntimeConfig.rpcUrls_5 ?? []) as [string, ...string[]],
    rpcUrls_17000: (serverRuntimeConfig.rpcUrls_17000 ?? []) as [
      string,
      ...string[]
    ],

    cspReportOnly: toBoolean(serverRuntimeConfig.cspReportOnly),

    rateLimit: Number(serverRuntimeConfig.rateLimit) || 50,
    rateLimitTimeFrame: Number(serverRuntimeConfig.rateLimitTimeFrame) || 60, // 1 minute;
  }
}

export const secretConfig = getSecretConfig()
