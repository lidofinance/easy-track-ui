import { useLocalStorage } from 'modules/hooks/useLocalStorage'
import { STORAGE_KEY_CONNECTOR } from 'modules/config'
import type { WalletConnectorsValue } from '../providers/walletConnectorsProvider'

type Connector = keyof WalletConnectorsValue

export function useWalletConnectorStorage() {
  return useLocalStorage<Connector | null>(STORAGE_KEY_CONNECTOR, null)
}
