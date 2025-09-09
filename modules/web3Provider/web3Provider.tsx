import {
  createContext,
  useContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
} from 'react'
import invariant from 'tiny-invariant'
import { http, type PublicClient } from 'viem'
import {
  WagmiProvider,
  createConfig,
  useConnections,
  usePublicClient,
  fallback,
  type Config,
} from 'wagmi'
import * as wagmiChains from 'wagmi/chains'

import { ReefKnotProvider, getDefaultConfig } from 'reef-knot/core-react'
import {
  ReefKnotWalletsModal,
  getDefaultWalletsModalConfig,
} from 'reef-knot/connect-wallet-modal'
import { WalletIdsEthereum, WalletsListEthereum } from 'reef-knot/wallets'

import { useThemeToggle } from '@lidofinance/lido-ui'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useWeb3Transport } from './useWeb3Transport'
import {
  MAX_PROVIDER_BATCH,
  PROVIDER_BATCH_TIME,
  PROVIDER_POLLING_INTERVAL,
} from 'modules/config'
import { CHAINS } from 'modules/blockChain/chains'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

type ChainsList = [wagmiChains.Chain, ...wagmiChains.Chain[]]

const WALLETS_PINNED: WalletIdsEthereum[] = ['browserExtension']

const WALLETS_SHOWN: WalletIdsEthereum[] = [
  'browserExtension',
  'metaMask',
  'okx',
  'ledgerHID',
  'ledgerLive',
  'walletConnect',
  'bitget',
  'imToken',
  'ambire',
  'safe',
  'dappBrowserInjected',
  'coinbaseSmartWallet',
]

export const wagmiChainMap = Object.values(wagmiChains).reduce((acc, chain) => {
  acc[chain.id] = chain
  return acc
}, {} as Record<number, wagmiChains.Chain>)

type Web3ProviderContextValue = {
  mainnetConfig: Config
  publicClientMainnet: PublicClient
}

const Web3ProviderContext = createContext<Web3ProviderContextValue | null>(null)
Web3ProviderContext.displayName = 'Web3ProviderContext'

export const useMainnetOnlyWagmi = () => {
  const value = useContext(Web3ProviderContext)
  invariant(value, 'useMainnetOnlyWagmi was used outside of Web3Provider')
  return value
}

export const Web3Provider: FC<PropsWithChildren> = ({ children }) => {
  const {
    supportedChainIds,
    defaultChain: defaultChainId,
    getRpcUrl,
  } = useConfig()
  const { themeName } = useThemeToggle()

  const { supportedChains, defaultChain } = useMemo(() => {
    // must preserve order of supportedChainIds
    const supportedChains = supportedChainIds.map(
      id => wagmiChainMap[id],
    ) as ChainsList

    const defaultChain = wagmiChainMap[defaultChainId]
    return {
      supportedChains,
      defaultChain,
    }
  }, [defaultChainId, supportedChainIds])

  const backendRPC: Record<number, string> = useMemo(
    () =>
      supportedChainIds.reduce(
        (res, curr) => ({ ...res, [curr]: getRpcUrl(curr) }),
        {},
      ),
    [supportedChainIds, getRpcUrl],
  )
  const { transportMap, onActiveConnection } = useWeb3Transport(
    supportedChains,
    backendRPC,
  )

  const mainnetConfig = useMemo(() => {
    const batchConfig = {
      wait: PROVIDER_BATCH_TIME,
      batchSize: MAX_PROVIDER_BATCH,
    }

    const rpcUrlMainnet = getRpcUrl(CHAINS.Mainnet)

    return createConfig({
      chains: [wagmiChains.mainnet],
      ssr: true,
      connectors: [],
      batch: {
        multicall: false,
      },
      pollingInterval: PROVIDER_POLLING_INTERVAL,
      transports: {
        [wagmiChains.mainnet.id]: fallback([
          // api/rpc
          http(rpcUrlMainnet, {
            batch: batchConfig,
            name: rpcUrlMainnet,
          }),
          // fallback rpc from wagmi.chains like cloudfare-eth
          http(undefined, {
            batch: batchConfig,
            name: 'default public RPC URL',
          }),
        ]),
      },
    })
  }, [getRpcUrl])

  const publicClientMainnet = usePublicClient({
    config: mainnetConfig,
  })

  const { wagmiConfig, reefKnotConfig, walletsModalConfig } = useMemo(() => {
    return getDefaultConfig({
      // Reef-Knot config args
      rpc: backendRPC,
      defaultChain: defaultChain,
      walletconnectProjectId: publicRuntimeConfig.walletconnectProjectId,
      walletsList: WalletsListEthereum,

      // Wagmi config args
      transports: transportMap,
      chains: supportedChains,
      autoConnect: true,
      ssr: true,
      pollingInterval: PROVIDER_POLLING_INTERVAL,
      batch: {
        multicall: false,
      },

      // Wallets config args
      ...getDefaultWalletsModalConfig(),
      walletsPinned: WALLETS_PINNED,
      walletsShown: WALLETS_SHOWN,
    })
  }, [backendRPC, supportedChains, defaultChain, transportMap])

  const [activeConnection] = useConnections({ config: wagmiConfig })

  useEffect(() => {
    void onActiveConnection(activeConnection)
  }, [activeConnection, onActiveConnection])

  return (
    <Web3ProviderContext.Provider
      value={{ mainnetConfig, publicClientMainnet }}
    >
      {/* default wagmi autoConnect, MUST be false in our case, because we use custom autoConnect from Reef Knot */}
      <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
        <ReefKnotProvider config={reefKnotConfig}>
          <ReefKnotWalletsModal
            config={walletsModalConfig}
            darkThemeEnabled={themeName === 'dark'}
          />
          {children}
        </ReefKnotProvider>
      </WagmiProvider>
    </Web3ProviderContext.Provider>
  )
}
