import { memo, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import Head from 'next/head'
import getConfig from 'next/config'
import NextApp, { AppProps, AppContext } from 'next/app'
import { useWeb3React } from '@web3-react/core'
import { useWalletAutoConnect } from 'modules/wallet/hooks/useWalletAutoConnect'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { Title } from 'modules/shared/ui/Common/Title'
import { PageLayout } from 'modules/shared/ui/Layout/PageLayout'
import { GlobalStyle } from 'modules/globalStyles'
import {
  Button,
  ThemeProvider,
  themeDefault,
  ToastContainer,
} from '@lidofinance/lido-ui'
import { ConfigProvider } from 'modules/config/providers/configProvider'
import { Web3AppProvider } from 'modules/blockChain/providers/web3Provider'
import { WalletConnectorsProvider } from 'modules/wallet/providers/walletConnectorsProvider'
import { ModalProvider } from 'modules/modal/ModalProvider'

import { getAddressList } from 'modules/config/utils/getAddressList'
import { Chains, getChainName } from 'modules/blockChain/chains'

const basePath = getConfig().publicRuntimeConfig.basePath || ''

const NetworksBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`

function AppRoot({ Component, pageProps }: AppProps) {
  useWalletAutoConnect()
  const chainId = useCurrentChain()
  const { library } = useWeb3React()
  const { supportedChainIds } = useConfig()
  const isChainSupported = useMemo(
    () => supportedChainIds.includes(chainId),
    [chainId, supportedChainIds],
  )

  const handleChangeNetwork = useCallback(
    (switchTo: Chains) => {
      if (!library) return
      library.send('wallet_switchEthereumChain', [
        { chainId: `0x${switchTo.toString(16)}` },
      ])
    },
    [library],
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
        {isChainSupported ? (
          <Component {...pageProps} />
        ) : (
          <>
            <Title
              title="Network does not match"
              subtitle={<>Please, switch to another network</>}
            />
            <NetworksBox>
              {supportedChainIds.map(supportedChainId => (
                <Button
                  key={supportedChainId}
                  size="sm"
                  variant="filled"
                  onClick={() => handleChangeNetwork(supportedChainId)}
                >
                  {getChainName(supportedChainId)}
                </Button>
              ))}
            </NetworksBox>
          </>
        )}
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
