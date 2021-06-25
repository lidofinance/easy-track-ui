import { useCallback } from 'react'
import { useSWR, SWRResponse } from 'modules/shared/hooks/useSwr'
import { FilterMethods, UnpackedPromise } from 'modules/shared/utils/utilTypes'

export const useContractRpcSwr = <
  C extends Object,
  M extends FilterMethods<C>,
  R extends UnpackedPromise<ReturnType<C[M]>>,
>(
  contract: C,
  method: M | null,
  ...params: Parameters<C[M]>
): SWRResponse<R, Error> => {
  const shouldFetch = method !== null
  const cacheKey = contract
  const args = [cacheKey, method, ...params]

  const rpcFetcher = useCallback(
    (_cacheKey: C, _method: M, ...p: Parameters<C[M]>): R | Promise<R> => {
      return contract[_method](...p)
    },
    [contract],
  )

  return useSWR<R, Error>(shouldFetch ? args : null, rpcFetcher)
}
