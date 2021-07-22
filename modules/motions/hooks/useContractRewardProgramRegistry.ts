import { JsonRpcProvider } from '@ethersproject/providers'
import { getRpcUrl } from 'modules/blockChain/utils/getRpcUrls'
import { useWeb3React } from '@web3-react/core'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { connectRewardProgramRegistry } from 'modules/blockChain/contracts'

export function useContractRewardProgramRegistryRpc() {
  const chainId = useCurrentChain()

  return useGlobalMemo(
    () =>
      connectRewardProgramRegistry({
        chainId,
        library: new JsonRpcProvider(getRpcUrl(chainId), chainId),
      }),
    ['reward-contract-registry-contract-rpc-', chainId].join('-'),
  )
}

export function useContractRewardProgramRegistryWeb3() {
  const { library, active, account } = useWeb3React()
  const chainId = useCurrentChain()

  return useGlobalMemo(
    () =>
      connectRewardProgramRegistry({
        chainId,
        library: library?.getSigner(),
      }),
    [
      'reward-contract-registry-contract-web3-',
      active ? 'active' : 'inactive',
      chainId,
      account,
    ].join('-'),
  )
}
