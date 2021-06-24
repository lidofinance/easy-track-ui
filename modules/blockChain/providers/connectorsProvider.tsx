import { createContext, useRef } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useConfig } from 'modules/config'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'

type ConnectorsValue = {
  metamask: InjectedConnector
  // trust: InjectedConnector;
  // imtoken: InjectedConnector;
  // walletconnect: WalletConnectConnector | null;
  // coinbase: WalletLinkConnector | null;
}

export const connectorsContext = createContext({} as ConnectorsValue)

type Props = {
  children?: React.ReactNode
}

export function ConnectorsProvider({ children }: Props) {
  const { currentChain } = useConfig()
  const { current } = useRef({
    isInited: false,
    connectors: {} as ConnectorsValue,
  })

  // const isMainnetSupported = supportedChainIds.includes(CHAINS.Mainnet)

  if (!current.isInited) {
    const injected = new InjectedConnector({
      supportedChainIds: [currentChain],
    })

    current.connectors.metamask = injected
    // current.connectors.trust = injected
    // current.connectors.imtoken = injected

    // current.connectors.walletconnect =
    //    new WalletConnectConnector({
    //     supportedChainIds,
    //     rpc: supportedChainIds.reduce(
    //       (acc: Record<number, string>, chainId) => {
    //         acc[chainId] = getRpcPath(chainId)
    //         return acc
    //       },
    //       {},
    //     ),
    //   })

    // current.connectors.coinbase =
    //    isMainnetSupported
    //     ? new WalletLinkConnector({
    //         // It's support only mainnet
    //         // https://github.com/NoahZinsmeister/web3-react/blob/v6/packages/walletlink-connector/src/index.ts
    //         url: getRpcPath(CHAINS.Mainnet),
    //         appName: 'Lido wstETH pool for Uniswap V3',
    //         appLogoUrl: `${baseUrl}/apple-touch-icon.png`,
    //         darkMode: false,
    //       })
    //     : null

    current.isInited = true
  }

  return (
    <connectorsContext.Provider
      value={current.connectors}
      children={children}
    />
  )
}
