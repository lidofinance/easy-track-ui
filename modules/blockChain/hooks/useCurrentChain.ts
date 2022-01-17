import { useMemo } from 'react'
import { useWeb3 } from '@lido-sdk/web3-react'
import { useConfig } from 'modules/config/hooks/useConfig'
import { parseChainId } from '../chains'

export const useCurrentChain = () => {
  const { defaultChain } = useConfig()
  const { chainId = defaultChain } = useWeb3()
  return useMemo(
    () => parseChainId(chainId || defaultChain),
    [chainId, defaultChain],
  )
}
