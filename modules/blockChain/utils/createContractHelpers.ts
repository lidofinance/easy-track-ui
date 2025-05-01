import { SWRConfiguration } from 'swr'
import { CHAINS } from '@lido-sdk/constants'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useContractSwr } from '../hooks/useContractSwr'

import type { Signer, providers } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'

import { getChainName } from 'modules/blockChain/chains'
import { FilterMethods } from 'modules/shared/utils/utilTypes'
import {
  AsyncMethodParameters,
  AsyncMethodReturns,
} from 'modules/types/filter-async-methods'
import { useConfig } from 'modules/config/hooks/useConfig'

type Library = JsonRpcSigner | Signer | providers.Provider

interface Factory {
  name: string
  connect(address: string, library: Library): unknown
}

type Address = {
  [key in CHAINS]?: string
}

type CreatorArgs<F> = {
  factory: F
  address: Address
}

type CallArgs = {
  chainId: CHAINS
  library: Library
}

type CallRpcArgs = {
  chainId: CHAINS
  rpcUrl: string
  cacheSeed?: number
}

export function createContractHelpers<F extends Factory>({
  address,
  factory,
}: CreatorArgs<F>) {
  type Instance = ReturnType<F['connect']>

  function connect({ chainId, library }: CallArgs) {
    if (!address.hasOwnProperty(chainId)) {
      const chainName = getChainName(chainId)
      throw new Error(
        `Contract ${factory.name} does not support chain ${chainName}`,
      )
    }

    return factory.connect(address[chainId] as string, library) as Instance
  }

  function connectRpc({ chainId, rpcUrl, cacheSeed }: CallRpcArgs) {
    const library = getStaticRpcBatchProvider(chainId, rpcUrl, cacheSeed ?? 0)
    return connect({ chainId, library })
  }

  function useInstanceRpc() {
    const { chainId } = useWeb3()
    const { getRpcUrl } = useConfig()
    const rpcUrl = getRpcUrl(chainId)

    return useGlobalMemo(
      () => connectRpc({ chainId, rpcUrl }),
      `contract-rpc-${chainId}-${rpcUrl}-${address[chainId]}`,
    )
  }

  function useInstanceWeb3() {
    const { library, active, account, chainId } = useWeb3()
    return useGlobalMemo(
      () =>
        connect({
          chainId,
          // TODO: find a way to remove ! here
          library: library?.getSigner()!,
        }),
      [
        'contract-web3-',
        active ? 'active' : 'inactive',
        library ? 'with-signer' : 'no-signer',
        chainId,
        address[chainId],
        account,
      ].join('-'),
    )
  }

  const getUseSwr = function (type: 'web3' | 'rpc') {
    return function <
      M extends FilterMethods<Instance>,
      Data extends AsyncMethodReturns<Instance, M>,
    >(
      method: M | null,
      params: AsyncMethodParameters<Instance, M>,
      config?: SWRConfiguration<Data>,
    ) {
      const contractInstance =
        type === 'web3' ? useInstanceWeb3() : useInstanceRpc()
      const data = useContractSwr(contractInstance, method, params, config)
      return data
    }
  }

  const useSwrWeb3 = getUseSwr('web3')
  const useSwrRpc = getUseSwr('rpc')

  return {
    address,
    factory,
    connect,
    connectRpc,
    useRpc: useInstanceRpc,
    useWeb3: useInstanceWeb3,
    useSwrWeb3,
    useSwrRpc,
  }
}
