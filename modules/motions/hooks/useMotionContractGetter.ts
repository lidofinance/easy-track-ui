import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { connectEasyTrack } from 'modules/blockChain/contracts'

export function useMotionContractGetter() {
  const { library } = useWeb3React()
  const currentChainId = useCurrentChain()

  return useCallback(
    () =>
      connectEasyTrack({
        chainId: currentChainId,
        library: library.getSigner(),
      }),
    [currentChainId, library],
  )
}
