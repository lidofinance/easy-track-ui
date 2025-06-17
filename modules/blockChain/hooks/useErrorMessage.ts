import { useMemo } from 'react'
import { useConnect } from 'wagmi'
import { useConfig } from 'modules/config/hooks/useConfig'

import { getChainName } from 'modules/blockChain/chains'
import { useIsChainSupported } from './useIsChainSupported'

export function useErrorMessage() {
  const { error } = useConnect()
  const isChainSupported = useIsChainSupported()
  const { supportedChainIds } = useConfig()

  const chains = useMemo(() => {
    const networksList = supportedChainIds.map(chainId => getChainName(chainId))
    return networksList.join(' / ')
  }, [supportedChainIds])

  if (!isChainSupported) {
    return `Unsupported chain. Please switch to ${chains} in your wallet.`
  }

  return error?.message
}
