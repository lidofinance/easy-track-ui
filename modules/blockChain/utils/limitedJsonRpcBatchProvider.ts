import { deepCopy } from '@ethersproject/properties'
import { fetchJson } from '@ethersproject/web'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { MAX_PROVIDER_BATCH } from 'modules/config'

export class LimitedJsonRpcBatchProvider extends StaticJsonRpcProvider {
  _pendingBatchAggregator: NodeJS.Timer | null = null
  _pendingBatch: {
    request: { method: string; params: any[]; id: number; jsonrpc: '2.0' }
    resolve: (result: any) => void
    reject: (error: Error) => void
  }[] = []

  async send(method: string, params: any[]): Promise<any> {
    const request = {
      method,
      params,
      id: this._nextId++,
      jsonrpc: '2.0' as const,
    }

    const inflight = { request, resolve: null as any, reject: null as any }

    const promise = new Promise((resolve, reject) => {
      inflight.resolve = resolve
      inflight.reject = reject
    })

    this._pendingBatch.push(inflight)

    if (!this._pendingBatchAggregator) {
      this._pendingBatchAggregator = setTimeout(() => {
        const pending = this._pendingBatch
        const chunkSize = MAX_PROVIDER_BATCH
        const batches: typeof pending[] = []

        for (let i = 0; i < pending.length; i += chunkSize) {
          batches.push(pending.slice(i, i + chunkSize))
        }

        this._pendingBatch = []
        this._pendingBatchAggregator = null

        void Promise.all(
          batches.map(batch => {
            const reqArray = batch.map(i => i.request)

            this.emit('debug', {
              action: 'requestBatch',
              request: deepCopy(reqArray),
              provider: this,
            })

            return fetchJson(this.connection, JSON.stringify(reqArray)).then(
              result => {
                this.emit('debug', {
                  action: 'response',
                  request: reqArray,
                  response: result,
                  provider: this,
                })

                batch.forEach((inflightItem, index) => {
                  const payload = result[index]
                  if (payload?.error) {
                    const error = new Error(payload.error.message)
                    ;(error as any).code = payload.error.code
                    ;(error as any).data = payload.error.data
                    inflightItem.reject(error)
                  } else {
                    inflightItem.resolve(payload?.result)
                  }
                })
              },
              error => {
                this.emit('debug', {
                  action: 'response',
                  error,
                  request: reqArray,
                  provider: this,
                })

                batch.forEach(inflightItem => {
                  inflightItem.reject(error)
                })
              },
            )
          }),
        )
      }, MAX_PROVIDER_BATCH)
    }

    return promise
  }
}

const providerCache = new Map<string, LimitedJsonRpcBatchProvider>()

export const getLimitedJsonRpcBatchProvider = (
  chainId: number,
  rpcUrl: string,
) => {
  const cacheKey = `${chainId}-${rpcUrl}`
  if (!providerCache.has(cacheKey)) {
    providerCache.set(
      cacheKey,
      new LimitedJsonRpcBatchProvider(rpcUrl, chainId),
    )
  }

  return providerCache.get(cacheKey) as LimitedJsonRpcBatchProvider
}
