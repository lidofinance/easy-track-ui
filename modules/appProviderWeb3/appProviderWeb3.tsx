import { backendRPC } from 'modules/blockChain/utils/getBackendRpcUrl'
import { useConfig } from 'modules/config/hooks/useConfig'
import getConfig from 'next/config'
import { ProviderWeb3 } from 'reef-knot/web3-react'

const { publicRuntimeConfig } = getConfig()

export function AppProviderWeb3({ children }: { children: React.ReactNode }) {
  const { supportedChainIds, defaultChain } = useConfig()
  return (
    <ProviderWeb3
      defaultChainId={defaultChain}
      supportedChainIds={supportedChainIds}
      rpc={backendRPC}
      walletconnectProjectId={publicRuntimeConfig.walletconnectProjectId}
    >
      {children}
    </ProviderWeb3>
  )
}
