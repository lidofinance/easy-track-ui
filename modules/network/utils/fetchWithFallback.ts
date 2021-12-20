import { METRICS_PREFIX } from 'modules/shared/metrics/constants'
import { Histogram } from 'prom-client'

type FetchWithFallback = (
  inputs: RequestInfo[],
  init?: RequestInit | undefined,
) => Promise<Response>

export const ethereumResponse = new Histogram({
  name: METRICS_PREFIX + 'ethereum_response',
  help: 'Ethereum response times',
  labelNames: ['provider'],
  buckets: [0.1, 0.2, 0.3, 0.6, 1, 1.5, 2, 5],
  registers: [],
})

export const fetchWithFallback: FetchWithFallback = async (inputs, init) => {
  const [input, ...restInputs] = inputs

  try {
    const url = new URL(input as string)
    const end = ethereumResponse.labels(url.hostname).startTimer()
    const response = await fetch(input, init)
    end()
    return response
  } catch (error) {
    if (!restInputs.length) throw error
    return fetchWithFallback(restInputs, init)
  }
}
