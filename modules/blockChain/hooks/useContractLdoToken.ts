import { JsonRpcProvider } from '@ethersproject/providers'
import { getRpcUrl } from 'modules/blockChain/utils/getRpcUrls'
import { useWeb3React } from '@web3-react/core'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { connectLDO } from 'modules/blockChain/contracts'

export function useContractLDORpc() {
  const chainId = useCurrentChain()

  return useGlobalMemo(
    () =>
      connectLDO({
        chainId,
        library: new JsonRpcProvider(getRpcUrl(chainId), chainId),
      }),
    `ldo-token-contract-rpc-${chainId}`,
  )
}

export function useContractLDOWeb3() {
  const { library, active, account } = useWeb3React()
  const chainId = useCurrentChain()

  return useGlobalMemo(
    () =>
      connectLDO({
        chainId,
        library: library?.getSigner(),
      }),
    [
      'ldo-token-contract-web3-',
      active ? 'active' : 'inactive',
      chainId,
      account,
    ].join('-'),
  )
}
