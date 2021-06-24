import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useConfig } from 'modules/config'
import { parseChainId } from '../chains'

export const useCurrentChain = () => {
  const { defaultChain } = useConfig()
  const { chainId = defaultChain } = useWeb3React()
  return useMemo(() => parseChainId(chainId), [chainId])
}
