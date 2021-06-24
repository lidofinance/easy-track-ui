import { useMemo, createContext, useContext } from 'react'
import { parseEnvConfig } from './parseEnvConfig'
import { EnvConfig, Config } from './types'

const configContext = createContext({} as Config)

export function useConfig() {
  return useContext(configContext)
}

type Props = {
  envConfig: EnvConfig
  children?: React.ReactNode
}

export function ConfigProvider({ children, envConfig }: Props) {
  const value = useMemo(() => parseEnvConfig(envConfig), [envConfig])
  return <configContext.Provider value={value} children={children} />
}
