import { useSWR } from 'modules/network/hooks/useSwr'
import { FilterMethods, UnpackedPromise } from 'modules/shared/utils/utilTypes'

export const useContractSwr = <
  Contract,
  Method extends FilterMethods<Contract>,
>(
  contract: Contract,
  method: Method | null,
  ...params: Parameters<Contract[Method]>
) => {
  const shouldFetch = method !== null
  const cacheKey = (contract as any).address
  const args = [cacheKey, method, ...params]

  return useSWR<UnpackedPromise<ReturnType<Contract[Method]>>>(
    shouldFetch ? args : null,
    () => (method !== null ? contract[method](...params) : null),
  )
}
