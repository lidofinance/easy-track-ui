import { useCallback } from 'react'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'

export function useCheckWalletConnect() {
  const { isWalletConnected } = useWalletInfo()
  const openConnectWalletModal = useConnectWalletModal()
  const checkWalletConnect = useCallback(() => {
    if (!isWalletConnected) {
      openConnectWalletModal()
      return false
    }
    return true
  }, [isWalletConnected, openConnectWalletModal])
  return checkWalletConnect
}
