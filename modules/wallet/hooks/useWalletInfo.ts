import { useWeb3 } from '@lido-sdk/web3-react'

export function useWalletInfo() {
  const web3 = useWeb3()

  return {
    isWalletConnected: web3.active,
    walletAddress: web3.account,
  }
}
