import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useConfig } from 'modules/config'
import { useConnectors } from 'modules/blockChain/hooks/useConnectors'

import { Text } from 'modules/ui/Common/Text'
import { Button } from '@lidofinance/lido-ui'
import { Wrap, Disconnect } from './HeaderWalletStyle'

export function HeaderWallet() {
  const web3 = useWeb3React()
  const { currentChain } = useConfig()
  const connectors = useConnectors()

  console.log(connectors.metamask)

  const handleConnect = useCallback(() => {
    web3.activate(connectors.metamask)
  }, [web3, connectors])

  const handleDisconnect = useCallback(() => {
    web3.deactivate()
  }, [web3])

  console.log(web3, currentChain)

  if (!web3.active) {
    return (
      <Wrap>
        <Button
          size="sm"
          onClick={handleConnect}
          children="Connect"
          style={{ width: '100%' }}
        />
      </Wrap>
    )
  }

  return (
    <Wrap>
      <Text title={String(web3.account)} size={12} weight={400}>
        {web3.account?.slice(0, 10)}...
      </Text>
      <Disconnect onClick={handleDisconnect}>Disconnect</Disconnect>
    </Wrap>
  )
}
