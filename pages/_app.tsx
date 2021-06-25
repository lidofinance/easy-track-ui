import { memo } from 'react'
import Head from 'next/head'
import getConfig from 'next/config'
import NextApp, { AppProps, AppContext } from 'next/app'
import { useWalletAutoConnect } from 'modules/wallet/hooks/useWalletAutoConnect'

import { PageLayout } from 'modules/shared/ui/Layout/PageLayout'
import { GlobalStyle } from 'modules/globalStyles'
import { ThemeProvider, themeDefault } from '@lidofinance/lido-ui'
import { ConfigProvider } from 'modules/config/providers/configProvider'
import { Web3AppProvider } from 'modules/blockChain/providers/web3Provider'
import { TokensProvider } from 'modules/blockChain/providers/tokensProvider'
import { WalletConnectorsProvider } from 'modules/wallet/providers/walletConnectorsProvider'
import { ModalProvider } from 'modules/modal/ModalProvider'
import { ToastContainer } from 'modules/toasts'
import 'modules/globalStyles/TT_Commons.css'

function AppRoot({ Component, pageProps }: AppProps) {
  useWalletAutoConnect()
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Lido EasyTracks</title>
      </Head>
      <PageLayout>
        <Component {...pageProps} />
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
            <TokensProvider>
              <ModalProvider>
                <AppRootMemo {...appProps} />
              </ModalProvider>
            </TokensProvider>
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
