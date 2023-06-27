import { FC } from 'react'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { getConnectors } from 'reef-knot/core-react'
import getConfig from 'next/config'
import { CHAINS } from '@lido-sdk/constants'
import { getBackendRpcUrl } from 'modules/blockChain/utils/getBackendRpcUrl'

const { publicRuntimeConfig } = getConfig()

let supportedChainIds: number[] = []
if (publicRuntimeConfig.supportedChains != null) {
  supportedChainIds = publicRuntimeConfig.supportedChains
    .split(',')
    .map((chainId: string) => parseInt(chainId))
    .filter((chainId: number) => !Number.isNaN(chainId))
} else if (publicRuntimeConfig.defaultChain != null) {
  supportedChainIds = [parseInt(publicRuntimeConfig.defaultChain)]
}

const wagmiChainsArray = Object.values(wagmiChains)
const supportedChains = wagmiChainsArray.filter(
  chain =>
    // Temporary wagmi fix, need to hardcode it to not affect non-wagmi wallets
    supportedChainIds.includes(chain.id) || chain.id === 80001,
)
const defaultChain = wagmiChainsArray.find(
  chain => chain.id === parseInt(publicRuntimeConfig.defaultChain),
)

const backendRPC = supportedChainIds.reduce<Record<number, string>>(
  (res, curr) => ({ ...res, [curr]: getBackendRpcUrl(curr) }),
  {
    // Required by reef-knot
    [CHAINS.Mainnet]: getBackendRpcUrl(CHAINS.Mainnet),
  },
)

const { chains, provider, webSocketProvider } = configureChains(
  supportedChains,
  [
    jsonRpcProvider({
      rpc: chain => ({
        http: backendRPC[chain.id],
      }),
    }),
  ],
)

const connectors = getConnectors({
  chains,
  defaultChain,
  rpc: backendRPC,
  walletconnectProjectId: publicRuntimeConfig.walletconnectProjectId,
})

const client = createClient({
  connectors,
  autoConnect: true,
  provider,
  webSocketProvider,
})

export const AppWagmiConfig: FC = ({ children }) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>
}
