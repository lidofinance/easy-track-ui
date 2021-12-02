import { memo, useMemo } from 'react'
import Head from 'next/head'
import getConfig from 'next/config'
import NextApp, { AppProps, AppContext } from 'next/app'
import { useWalletAutoConnect } from 'modules/wallet/hooks/useWalletAutoConnect'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { PageLayout } from 'modules/shared/ui/Layout/PageLayout'
import { GlobalStyle } from 'modules/globalStyles'
import {
  ThemeProvider,
  themeDefault,
  ToastContainer,
} from '@lidofinance/lido-ui'
import { ConfigProvider } from 'modules/config/providers/configProvider'
import { Web3AppProvider } from 'modules/blockChain/providers/web3Provider'
import { WalletConnectorsProvider } from 'modules/wallet/providers/walletConnectorsProvider'
import { ModalProvider } from 'modules/modal/ModalProvider'
import { NetworkSwitcher } from 'modules/blockChain/ui/NetworkSwitcher'

import { getAddressList } from 'modules/config/utils/getAddressList'

const basePath = getConfig().publicRuntimeConfig.basePath || ''

function AppRoot({ Component, pageProps }: AppProps) {
  useWalletAutoConnect()
  const chainId = useCurrentChain()
  const { supportedChainIds } = useConfig()
  const isChainSupported = useMemo(
    () => supportedChainIds.includes(chainId),
    [chainId, supportedChainIds],
  )

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Lido Easy Track</title>

        <link rel="manifest" href={`${basePath}/manifest.json`} />
        <link
          rel="icon"
          type="image/svg+xml"
          href={`${basePath}/favicon-1080x1080.svg`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${basePath}/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={`${basePath}/favicon-192x192.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="180x180"
          href={`${basePath}/favicon-180x180.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${basePath}/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${basePath}/favicon-16x16.png`}
        />

        <meta name="currentChain" content={String(chainId)} />
        {getAddressList(chainId).map(({ contractName, address }) => (
          <meta key={contractName} name={contractName} content={address} />
        ))}
      </Head>
      <PageLayout>
        {isChainSupported ? <Component {...pageProps} /> : <NetworkSwitcher />}
      </PageLayout>
      <ToastContainer />
    </>
  )
}

const AppRootMemo = memo(AppRoot)

type Props = AppProps & {
  envConfig: React.ComponentProps<typeof ConfigProvider>['envConfig']
}

export default function App({ envConfig, ...appProps }: Props) {
  return (
    <ThemeProvider theme={themeDefault}>
      <GlobalStyle />
      <ConfigProvider envConfig={envConfig}>
        <Web3AppProvider>
          <WalletConnectorsProvider>
            <ModalProvider>
              <AppRootMemo {...appProps} />
            </ModalProvider>
          </WalletConnectorsProvider>
        </Web3AppProvider>
      </ConfigProvider>
    </ThemeProvider>
  )
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext)
  const { publicRuntimeConfig } = getConfig()
  return { ...appProps, envConfig: publicRuntimeConfig }
}
