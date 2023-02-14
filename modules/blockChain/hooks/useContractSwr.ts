import { SWRConfiguration } from 'swr'
import { useSWR } from 'modules/network/hooks/useSwr'
import { FilterMethods } from 'modules/shared/utils/utilTypes'
import {
  AsyncMethodParameters,
  AsyncMethodReturns,
} from 'modules/types/filter-async-methods'

export function useContractSwr<
  Contract,
  Method extends FilterMethods<Contract>,
  Data extends AsyncMethodReturns<Contract, Method>,
>(
  contract: Contract,
  method: Method | null,
  params: AsyncMethodParameters<Contract, Method>,
  config?: SWRConfiguration<Data>,
) {
  const shouldFetch = method !== null
  const cacheKey = (contract as any).address
  const args = [cacheKey, method, ...params]

  return useSWR<Data>(
    shouldFetch ? args : null,
    () => (method !== null ? (contract as any)[method](...params) : null),
    config,
  )
}
