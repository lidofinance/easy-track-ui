import { useWeb3React } from '@web3-react/core'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { connectEasyTrack } from 'modules/blockChain/contracts'

export function useMotionContractWeb3() {
  const { library, active, account } = useWeb3React()
  const currentChainId = useCurrentChain()

  return useGlobalMemo(
    () =>
      connectEasyTrack({
        chainId: currentChainId,
        library: library?.getSigner(),
      }),
    [
      'easytrack-contract',
      active ? 'active' : 'inactive',
      currentChainId,
      account,
    ].join('-'),
  )
}
