import { useLocalStorage } from 'modules/hooks/useLocalStorage'
import { STORAGE_KEY_CONNECTOR } from 'modules/config'
import type { ConnectorsValue } from '../providers/connectorsProvider'

type Connector = keyof ConnectorsValue

export function useConnectorStorage() {
  return useLocalStorage<Connector | null>(STORAGE_KEY_CONNECTOR, null)
}
