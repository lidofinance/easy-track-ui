import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { SUPPORTED_CHAINS as SDK_SUPPORTED_CHAINS } from '@lidofinance/lido-ethereum-sdk/common'
import { useConfig } from 'modules/config/hooks/useConfig'

export const useIsChainSupported = () => {
  const { chainId: walletChain } = useAccount()
  const { supportedChainIds } = useConfig()

  return useMemo(() => {
    return walletChain
      ? supportedChainIds.includes(walletChain) &&
          Boolean(walletChain && SDK_SUPPORTED_CHAINS.includes(walletChain))
      : true
  }, [supportedChainIds, walletChain])
}
