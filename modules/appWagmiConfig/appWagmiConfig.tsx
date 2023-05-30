import { FC } from 'react'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { getConnectors } from 'reef-knot/core-react'
import getConfig from 'next/config'
import { useConfig } from 'modules/config/hooks/useConfig'
import {
  backendRPC,
  getBackendRpcUrl,
} from 'modules/blockChain/utils/getBackendRpcUrl'

const { publicRuntimeConfig } = getConfig()

export const AppWagmiConfig: FC = ({ children }) => {
  const { supportedChainIds } = useConfig()

  const supportedChains = Object.values(wagmiChains).filter(chain =>
    supportedChainIds.includes(chain.id),
  )

  const connectors = getConnectors({
    rpc: backendRPC,
    walletconnectProjectId: publicRuntimeConfig.walletconnectProjectId,
  })

  const { provider, webSocketProvider } = configureChains(supportedChains, [
    jsonRpcProvider({
      rpc: chain => ({
        http: getBackendRpcUrl(chain.id),
      }),
    }),
  ])

  const client = createClient({
    connectors,
    autoConnect: true,
    provider,
    webSocketProvider,
  })

  return <WagmiConfig client={client}>{children}</WagmiConfig>
}
