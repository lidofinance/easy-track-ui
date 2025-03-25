import { FC } from 'react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { getConnectors } from 'reef-knot/core-react'
import { CHAINS } from '@lido-sdk/constants'
import { getBackendRpcUrl } from 'modules/blockChain/utils/getBackendRpcUrl'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const holesky = {
  id: CHAINS.Holesky,
  name: 'Holesky',
  network: 'holesky',
  nativeCurrency: {
    decimals: 18,
    name: 'holeskyETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: [getBackendRpcUrl(CHAINS.Holesky)] },
    default: { http: [getBackendRpcUrl(CHAINS.Holesky)] },
  },
  blockExplorers: {
    etherscan: { name: 'holesky', url: 'https://holesky.etherscan.io/' },
    default: { name: 'holesky', url: 'https://holesky.etherscan.io/' },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 77,
    },
  },
} as const

let supportedChainIds: number[] = []
supportedChainIds = publicRuntimeConfig.supportedChains
  .split(',')
  .map((chainId: string) => parseInt(chainId))
  .filter((chainId: number) => !Number.isNaN(chainId))

const wagmiChainsArray = Object.values({
  ...wagmiChains,
  [CHAINS.Holesky]: holesky,
})

const supportedChains = wagmiChainsArray.filter(
  chain =>
    // Temporary wagmi fix, need to hardcode it to not affect non-wagmi wallets
    supportedChainIds.includes(chain.id) || chain.id === 80001,
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
  defaultChain: publicRuntimeConfig.defaultChain,
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
