import { useMemo } from 'react'
import { useWeb3 as useWeb3Lido } from '@lido-sdk/web3-react'
import { useConfig } from 'modules/config/hooks/useConfig'
// import { Web3Provider } from '@ethersproject/providers'
import { parseChainId } from '../chains'

export function useWeb3() {
  const web3 = useWeb3Lido()
  const { defaultChain } = useConfig()
  const { chainId } = web3

  const currentChain = useMemo(
    () => parseChainId(chainId || defaultChain),
    [chainId, defaultChain],
  )

  return {
    ...web3,
    isWalletConnected: web3.active,
    walletAddress: web3.account,
    chainId: currentChain,
  }
}
