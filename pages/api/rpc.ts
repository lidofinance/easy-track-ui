import getConfig from 'next/config'
import type { NextApiRequest, NextApiResponse } from 'next'
import { parseChainId } from 'modules/blockChain/chains'
import { CHAINS } from '@lido-sdk/constants'

import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'
import clone from 'just-clone'
import type {
  JsonRpcError,
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcResult,
} from '@walletconnect/jsonrpc-types'

const { serverRuntimeConfig } = getConfig()
const { rpcUrls_1, rpcUrls_17000, rpcUrls_560048 } = serverRuntimeConfig

const parseAndFilterResults = (
  netResponse: Response,
  text: string,
): { results: JsonRpcResult[]; errors: JsonRpcError[] } => {
  const { status } = netResponse
  const trace = netResponse.headers.get('x-drpc-trace-id') || ''
  const results: JsonRpcResult[] = []
  const errors: JsonRpcError[] = []
  try {
    const responses = JSON.parse(text) as JsonRpcResponse[]

    responses.forEach(response => {
      if ('error' in response) {
        const { id, error } = response
        console.error(
          `Request failed id ${id} error ${error.message} trace ${trace}`,
        )
        errors.push(response)
        return
      }
      results.push(response)
    })
    return { results, errors }
  } catch (err) {
    // usually could happen when response status 400+
    console.error(`Request failed status ${status} body ${text} trace ${trace}`)
    return { results: [], errors: [] }
  }
}

const fetchWithSmartFallback = async (
  urlsAll: string[],
  chainId: CHAINS,
  body: JsonRpcRequest | JsonRpcRequest[],
): Promise<[Response, JsonRpcResponse | JsonRpcResponse[]]> => {
  const isBatch = Array.isArray(body)
  const requests: JsonRpcRequest[] = isBatch ? body : [body]

  const results: JsonRpcResponse[] = []
  let errors: JsonRpcError[] = []
  const requestIds = new Set<number>(requests.map(request => request.id))
  let netResponse: Response | null = null

  for (const index of Object.keys(urlsAll)) {
    const urls = urlsAll.slice(Number(index))
    const filtered = requests.filter(request => requestIds.has(request.id))

    netResponse = await fetchWithFallback(urls, chainId, {
      method: 'POST',
      // Next by default parses our body for us, we don't want that here
      body: JSON.stringify(filtered),
      headers: {
        'Content-type': 'application/json',
      },
    })

    const text = await netResponse.text()
    const parsed = parseAndFilterResults(netResponse, text)

    parsed.results.forEach(response => {
      results.push(response)
      requestIds.delete(response.id)
    })

    if (requestIds.size > 0) {
      errors = parsed.errors
      continue
    }

    return [netResponse, isBatch ? results : results[0]]
  }

  if (netResponse) {
    return [netResponse, isBatch ? [...results, ...errors] : errors[0]]
  }
  throw new Error(`Can't resolve some requests`)
}

export default async function rpc(req: NextApiRequest, res: NextApiResponse) {
  const RPC_URLS: Record<number, string[]> = {
    [CHAINS.Mainnet]: rpcUrls_1,
    [CHAINS.Holesky]: rpcUrls_17000,
    [CHAINS.Hoodi]: rpcUrls_560048,
  }

  const requestInfo = {
    type: 'API request',
    path: 'rpc',
    body: clone(req.body),
    query: clone(req.query),
    method: req.method,
    stage: 'INCOMING',
  }

  console.info('Incoming request to api/rpc', requestInfo)

  try {
    const chainId = parseChainId(String(req.query.chainId))
    const urls = RPC_URLS[chainId]

    const { body } = req
    const [response, results] = await fetchWithSmartFallback(
      urls,
      chainId,
      body,
    )
    const { headers, status } = response

    res
      .setHeader('x-drpc-owner-tier', headers.get('x-drpc-owner-tier') ?? '')
      .setHeader('x-drpc-trace-id', headers.get('x-drpc-trace-id') ?? '')
      .setHeader('x-drpc-date', headers.get('date') ?? '')
      .status(status)
      .json(results)

    console.info('Request to api/rpc successfully fullfilled', {
      ...requestInfo,
      stage: 'FULFILLED',
    })
  } catch (error) {
    if (error instanceof Error && Array.isArray(error.cause)) {
      const [response, text] = error.cause
      parseAndFilterResults(response, text)
    }
    console.error(
      error instanceof Error ? error.message : 'Something went wrong',
      error,
    )
    res.status(500).send({ error: 'Something went wrong!' })
  }
}
