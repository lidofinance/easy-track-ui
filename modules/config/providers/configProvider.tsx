import { createContext, useState, useCallback } from 'react'
import { EnvConfigParsed } from '../types'
import { CHAINS } from '@lido-sdk/constants'
import { useLocalStorage } from '@lido-sdk/react'
import { STORAGE_KEY_SAVED_SETTINGS } from '../storage'
import { getRpcUrlDefault } from '../network'

type SavedConfig = {
  rpcUrls: Partial<Record<CHAINS, string>>
}

type ConfigContext = EnvConfigParsed & {
  getRpcUrl: (chainId: CHAINS) => string
  savedConfig: SavedConfig
  setSavedConfig: React.Dispatch<React.SetStateAction<SavedConfig>>
}

export const configContext = createContext({} as ConfigContext)

type Props = {
  envConfig: EnvConfigParsed
  children?: React.ReactNode
}

const DEFAULT_STATE = {
  rpcUrls: {},
}

export function ConfigProvider({ children, envConfig }: Props) {
  const [restoredSettings, setLocalStorage] = useLocalStorage(
    STORAGE_KEY_SAVED_SETTINGS,
    DEFAULT_STATE,
  )

  const [savedConfig, setSavedConfig] = useState<SavedConfig>(restoredSettings)

  const setSavedConfigAndRemember = useCallback(
    (config: SavedConfig) => {
      setLocalStorage(config)
      setSavedConfig(config)
    },
    [setLocalStorage],
  )

  const getRpcUrl = useCallback(
    (chainId: CHAINS) => {
      return savedConfig.rpcUrls[chainId] || getRpcUrlDefault(chainId)
    },
    [savedConfig.rpcUrls],
  )

  return (
    <configContext.Provider
      value={{
        ...envConfig,
        getRpcUrl,
        savedConfig,
        setSavedConfig: setSavedConfigAndRemember,
      }}
      children={children}
    />
  )
}
