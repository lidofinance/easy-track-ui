import {
  createContext,
  useRef,
  useMemo,
  //  useEffect
} from 'react'
import { useConfig } from 'modules/config/hooks/useConfig'
// import {
//   useSafeAppConnection,
//   SafeAppConnector,
// } from '@gnosis.pm/safe-apps-web3-react'

import { InjectedConnector } from '@web3-react/injected-connector'
import { Chains } from 'modules/blockChain/chains'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { getRpcUrl } from 'modules/blockChain/utils/getRpcUrls'
import { isClientSide } from 'modules/shared/utils/isClientSide'

export type WalletConnectorsValue = {
  metamask: InjectedConnector
  trust: InjectedConnector
  imtoken: InjectedConnector
  walletconnect: WalletConnectConnector | null
  coinbase: WalletLinkConnector | null
  // gnosisSafe: SafeAppConnector
}

export const walletConnectorsContext = createContext(
  {} as WalletConnectorsValue,
)

type Props = {
  children?: React.ReactNode
}

export function WalletConnectorsProvider({ children }: Props) {
  const { supportedChainIds } = useConfig()
  const { current } = useRef({
    isInited: false,
    connectors: {} as WalletConnectorsValue,
  })

  const isMainnetSupported = useMemo(
    () => supportedChainIds.includes(Chains.Mainnet),
    [supportedChainIds],
  )

  if (!current.isInited && isClientSide()) {
    current.connectors.metamask = new InjectedConnector({})
    current.connectors.trust = new InjectedConnector({})
    current.connectors.imtoken = new InjectedConnector({})
    // current.connectors.gnosisSafe = new SafeAppConnector()

    current.connectors.walletconnect = new WalletConnectConnector({
      // supportedChainIds,
      // rpc: supportedChainIds.reduce<Record<number, string>>(
      rpc: Object.values(Chains).reduce<Record<number, string>>(
        (acc, chainId) => ({
          ...acc,
          [chainId]: getRpcUrl(chainId),
        }),
        {},
      ),
    })

    const baseUrl = isClientSide() ? window.location.origin : ''

    // It's support only mainnet
    // https://github.com/NoahZinsmeister/web3-react/blob/v6/packages/walletlink-connector/src/index.ts
    current.connectors.coinbase = isMainnetSupported
      ? new WalletLinkConnector({
          url: getRpcUrl(Chains.Mainnet),
          appName: 'Lido wstETH pool for Uniswap V3',
          appLogoUrl: `${baseUrl}/apple-touch-icon.png`,
          darkMode: false,
        })
      : null

    current.isInited = true
  }

  // const triedToConnectToSafe = useSafeAppConnection(
  //   current.connectors.gnosisSafe,
  // )

  // useEffect(() => {
  //   if (triedToConnectToSafe) {
  //     // is not gnosis safe
  //     eagerConnect()
  //   }
  // }, [eagerConnect, triedToConnectToSafe])

  // useEffect(() => {
  //   if (isMobile && hasInjectedEthereum && triedToConnectToSafe) {
  //     activate(injected)
  //   }
  // }, [activate, hasInjectedEthereum, injected, triedToConnectToSafe])

  return (
    <walletConnectorsContext.Provider
      value={current.connectors}
      children={children}
    />
  )
}
