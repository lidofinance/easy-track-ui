import { SWRConfiguration } from 'swr'
import { CHAINS } from '@lido-sdk/constants'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useContractSwr } from '../hooks/useContractSwr'

import type { Signer, providers } from 'ethers'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { getRpcUrl } from 'modules/blockChain/utils/getRpcUrls'
import { getChainName } from 'modules/blockChain/chains'
import { FilterMethods, UnpackedPromise } from 'modules/shared/utils/utilTypes'

type Library = Signer | providers.Provider

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

  function useInstanceRpc() {
    const { chainId } = useWeb3()

    return useGlobalMemo(
      () =>
        connect({
          chainId,
          library: getStaticRpcBatchProvider(chainId, getRpcUrl(chainId)),
        }),
      `contract-rpc-${chainId}-${address[chainId]}`,
    )
  }

  function useInstanceWeb3() {
    const { library, active, account, chainId } = useWeb3()

    return useGlobalMemo(
      () =>
        connect({
          chainId,
          library: library?.getSigner(),
        }),
      [
        'contract-web3-',
        active ? 'active' : 'inactive',
        chainId,
        address[chainId],
        account,
      ].join('-'),
    )
  }

  const getUseSwr = function (type: 'web3' | 'rpc') {
    return function <
      M extends FilterMethods<Instance>,
      Data extends UnpackedPromise<ReturnType<Instance[M]>>,
    >(
      method: M | null,
      params: Parameters<Instance[M]>,
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
    useRpc: useInstanceRpc,
    useWeb3: useInstanceWeb3,
    useSwrWeb3,
    useSwrRpc,
  }
}
