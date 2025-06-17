import { SWRConfiguration } from 'swr'
import { providers } from 'ethers'
import { CHAINS } from '../chains'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useContractSwr } from '../hooks/useContractSwr'

import type { JsonRpcSigner } from '@ethersproject/providers'
import { getChainName } from 'modules/blockChain/chains'
import { FilterMethods } from 'modules/shared/utils/utilTypes'
import {
  AsyncMethodParameters,
  AsyncMethodReturns,
} from 'modules/types/filter-async-methods'
import { useConfig } from 'modules/config/hooks/useConfig'
import { getLimitedJsonRpcBatchProvider } from 'modules/blockChain/utils/limitedJsonRpcBatchProvider'

type Web3Provider = JsonRpcSigner | providers.Provider

interface Factory {
  name: string
  connect(address: string, provider: Web3Provider): unknown
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
  provider: Web3Provider
}

type CallRpcArgs = {
  chainId: CHAINS
  rpcUrl: string
  cacheSeed?: string
}

export function createContractHelpers<F extends Factory>({
  address,
  factory,
}: CreatorArgs<F>) {
  type Instance = ReturnType<F['connect']>

  function connect({ chainId, provider }: CallArgs) {
    if (!address.hasOwnProperty(chainId)) {
      const chainName = getChainName(chainId)
      throw new Error(
        `Contract ${factory.name} does not support chain ${chainName}`,
      )
    }

    return factory.connect(address[chainId] as string, provider) as Instance
  }

  function connectRpc({ chainId, rpcUrl }: CallRpcArgs) {
    const provider = getLimitedJsonRpcBatchProvider(chainId, rpcUrl)
    return connect({ chainId, provider })
  }

  function useInstanceRpc() {
    const { chainId } = useWeb3()
    const { getRpcUrl } = useConfig()
    const rpcUrl = getRpcUrl(chainId)

    const cacheKey = `contract-rpc-${chainId}-${rpcUrl}-${address[chainId]}`
    return useGlobalMemo(() => connectRpc({ chainId, rpcUrl }), cacheKey)
  }

  function useInstanceWeb3() {
    const { web3Provider, isWalletConnected, walletAddress, chainId } =
      useWeb3()
    return useGlobalMemo(
      () =>
        connect({
          chainId,
          // TODO: find a way to remove ! here
          provider: web3Provider!,
        }),
      [
        'contract-web3-',
        isWalletConnected ? 'active' : 'inactive',
        web3Provider ? 'with-signer' : 'no-signer',
        chainId,
        address[chainId],
        walletAddress,
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
