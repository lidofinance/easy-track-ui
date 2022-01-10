import { InjectedConnector } from '@web3-react/injected-connector'
import { CHAINS } from '@lido-sdk/constants'

import { useWeb3 } from '@lido-sdk/web3-react'
import { useCallback } from 'react'
import { useConfig } from 'modules/config/hooks/useConfig'

import { Button } from '@lidofinance/lido-ui'
import { Text } from 'modules/shared/ui/Common/Text'
import { Title } from 'modules/shared/ui/Common/Title'
import { NetworksBox } from './NetworkSwitcherStyle'

import { getChainName } from 'modules/blockChain/chains'

export function NetworkSwitcher() {
  const { connector } = useWeb3()
  const { supportedChainIds } = useConfig()

  const isMetamaskConnected =
    connector instanceof InjectedConnector &&
    !!(window as any).ethereum?.isMetaMask

  const handleChangeNetwork = useCallback(
    (switchTo: CHAINS) => {
      if (!isMetamaskConnected) return

      const provider = window.ethereum as any
      provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${switchTo.toString(16)}` },
      ])
    },
    [isMetamaskConnected],
  )

  return (
    <>
      <Title
        title="Network does not match"
        subtitle={<>Please, switch to one of supported network:</>}
      />
      {isMetamaskConnected && (
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
      )}
      {!isMetamaskConnected && (
        <Text size={16} weight={500} isCentered>
          {supportedChainIds.map(supportedChainId => (
            <div key={supportedChainId}>{getChainName(supportedChainId)}</div>
          ))}
        </Text>
      )}
    </>
  )
}
