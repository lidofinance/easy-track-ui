import { useWeb3React } from '@web3-react/core'

export function useWalletConnect() {
  const { activate } = useWeb3React()
  return activate
}
