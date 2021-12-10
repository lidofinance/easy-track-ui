import { useCallback } from 'react'
import { useWalletConnect } from '../../hooks/useWalletConnect'
import { useWalletConnectors } from '../../hooks/useWalletConnectors'
import { WalletConnectCircle } from '@lidofinance/icons'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'

export function ConnectWalletConnectButton(props: ConnectWalletButtonProps) {
  const { onConnect, disabled, ...rest } = props
  const connect = useWalletConnect()
  const { walletconnect: connector } = useWalletConnectors()

  const handleConnect = useCallback(async () => {
    if (!connector) return

    onConnect?.()
    connector.deactivate()
    await connector.close()
    await connect(connector)
  }, [connector, connect, onConnect])

  return (
    <ConnectButton
      {...rest}
      disabled={!connector || disabled}
      icon={<WalletConnectCircle />}
      onClick={handleConnect}
    >
      WalletConnect
    </ConnectButton>
  )
}
