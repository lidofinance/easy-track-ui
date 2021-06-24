import Head from 'next/head'
import getConfig from 'next/config'
import NextApp, { AppProps, AppContext } from 'next/app'

import { PageLayout } from 'modules/ui/Layout/PageLayout'
import { GlobalStyle } from 'modules/globalStyles'
import { ThemeProvider, themeDefault } from '@lidofinance/lido-ui'
import { ConfigProvider } from 'modules/config'
import { Web3AppProvider } from 'modules/blockChain/providers/web3Provider'
import { ConnectorsProvider } from 'modules/blockChain/providers/connectorsProvider'
import 'modules/globalStyles/TT_Commons.css'

type Props = AppProps & {
  envConfig: React.ComponentProps<typeof ConfigProvider>['envConfig']
}

export default function App({ Component, pageProps, envConfig }: Props) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Lido EasyTracks</title>
      </Head>
      <ThemeProvider theme={themeDefault}>
        <GlobalStyle />
        <ConfigProvider envConfig={envConfig}>
          <Web3AppProvider>
            <ConnectorsProvider>
              <PageLayout>
                <Component {...pageProps} />
              </PageLayout>
            </ConnectorsProvider>
          </Web3AppProvider>
        </ConfigProvider>
      </ThemeProvider>
    </>
  )
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext)
  const { publicRuntimeConfig } = getConfig()
  return { ...appProps, envConfig: publicRuntimeConfig }
}
