import { memo } from 'react'
import Head from 'next/head'
import getConfig from 'next/config'
import NextApp, { AppProps, AppContext } from 'next/app'
import { useAutoConnectWallet } from 'modules/wallet/hooks/useAutoConnectWallet'

import { PageLayout } from 'modules/ui/Layout/PageLayout'
import { GlobalStyle } from 'modules/globalStyles'
import { ThemeProvider, themeDefault } from '@lidofinance/lido-ui'
import { ConfigProvider } from 'modules/config'
import { Web3AppProvider } from 'modules/blockChain/providers/web3Provider'
import { ConnectorsProvider } from 'modules/wallet/providers/connectorsProvider'
import { ModalProvider } from 'modules/modal/ModalProvider'
import 'modules/globalStyles/TT_Commons.css'

function AppRoot({ Component, pageProps }: AppProps) {
  useAutoConnectWallet()
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
          <ConnectorsProvider>
            <ModalProvider>
              <AppRootMemo {...appProps} />
            </ModalProvider>
          </ConnectorsProvider>
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
