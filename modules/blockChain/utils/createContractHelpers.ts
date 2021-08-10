import type { Signer, providers } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { getRpcUrl } from 'modules/blockChain/utils/getRpcUrls'
import { useWeb3React } from '@web3-react/core'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { Chains, getChainName } from 'modules/blockChain/chains'

type Library = Signer | providers.Provider

interface Factory {
  name: string
  connect(address: string, library: Library): unknown
}

type Address = {
  [key in Chains]?: string
}

type CreatorArgs<F> = {
  factory: F
  address: Address
}

type CallArgs = {
  chainId: Chains
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

  function useRpc() {
    const chainId = useCurrentChain()

    return useGlobalMemo(
      () =>
        connect({
          chainId,
          library: new JsonRpcProvider(getRpcUrl(chainId), chainId),
        }),
      `contract-rpc-${address[chainId]}`,
    )
  }

  function useWeb3() {
    const { library, active, account } = useWeb3React()
    const chainId = useCurrentChain()

    return useGlobalMemo(
      () =>
        connect({
          chainId,
          library: library?.getSigner(),
        }),
      [
        'contract-web3-',
        active ? 'active' : 'inactive',
        address[chainId],
        account,
      ].join('-'),
    )
  }

  return {
    address,
    factory,
    connect,
    useRpc,
    useWeb3,
  }
}
