import { useWeb3React } from '@web3-react/core'

export function useWalletInfo() {
  const web3 = useWeb3React()

  return {
    isWalletConnected: web3.active,
    walletAddress: web3.account,
  }
}
