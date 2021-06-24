import { useContext } from 'react'
import { walletConnectorsContext } from '../providers/walletConnectorsProvider'

export function useWalletConnectors() {
  return useContext(walletConnectorsContext)
}
