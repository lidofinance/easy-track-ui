import { useCallback } from 'react'
import { useSWR, SWRResponse } from 'modules/network/hooks/useSwr'
import { FilterMethods, UnpackedPromise } from 'modules/shared/utils/utilTypes'

export const useContractSwr = <
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

  const fetcher = useCallback(
    (_contract: C, _method: M, ...p: Parameters<C[M]>): R | Promise<R> => {
      return _contract[_method](...p)
    },
    [],
  )

  return useSWR<R, Error>(shouldFetch ? args : null, fetcher)
}
