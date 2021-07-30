import { JsonRpcProvider } from '@ethersproject/providers'
import { getRpcUrl } from 'modules/blockChain/utils/getRpcUrls'
import { useWeb3React } from '@web3-react/core'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { connectNodeOperatorsRegistry } from 'modules/blockChain/contracts'

export function useContractMotionRpc() {
  const chainId = useCurrentChain()

  return useGlobalMemo(
    () =>
      connectNodeOperatorsRegistry({
        chainId,
        library: new JsonRpcProvider(getRpcUrl(chainId), chainId),
      }),
    `easytrack-contract-rpc-${chainId}`,
  )
}

export function useContractMotionWeb3() {
  const { library, active, account } = useWeb3React()
  const chainId = useCurrentChain()

  return useGlobalMemo(
    () =>
      connectNodeOperatorsRegistry({
        chainId,
        library: library?.getSigner(),
      }),
    [
      'easytrack-contract-web3-',
      active ? 'active' : 'inactive',
      chainId,
      account,
    ].join('-'),
  )
}
