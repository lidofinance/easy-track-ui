import { SWRConfiguration } from 'swr'
import { useSWR } from 'modules/network/hooks/useSwr'
import { FilterMethods, UnpackedPromise } from 'modules/shared/utils/utilTypes'

export function useContractSwr<
  Contract,
  Method extends FilterMethods<Contract>,
  Data extends UnpackedPromise<ReturnType<Contract[Method]>>,
>(
  contract: Contract,
  method: Method | null,
  params: Parameters<Contract[Method]>,
  config?: SWRConfiguration<Data>,
) {
  const shouldFetch = method !== null
  const cacheKey = (contract as any).address
  const args = [cacheKey, method, ...params]

  return useSWR<Data>(
    shouldFetch ? args : null,
    () => (method !== null ? contract[method](...params) : null),
    config,
  )
}
