import { TOKENS } from '../tokens'
import { ContractByToken, getTokenContractRpc } from '../utils/getTokenContract'
import { SWRResponse } from 'modules/shared/hooks/useSwr'
import { FilterMethods, UnpackedPromise } from 'modules/shared/utils/utilTypes'
import { useContractRpcSwr } from '../../blockChain/hooks/useContractRpcSwr'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useCurrentChain } from '../../blockChain/hooks/useCurrentChain'

export const useTokenRpcSwr = <
  T extends TOKENS,
  C extends ContractByToken<T>,
  M extends FilterMethods<C>,
  R extends UnpackedPromise<ReturnType<C[M]>>,
>(
  token: T,
  method: M | null,
  ...params: Parameters<C[M]>
): SWRResponse<R, Error> => {
  const chainId = useCurrentChain()

  const contract = useGlobalMemo(() => {
    return getTokenContractRpc(chainId, token)
  }, `token-contract-${chainId}-${token}`) as C

  return useContractRpcSwr<C, M, R>(contract, method, ...params)
}
