import { useCallback } from 'react'
import { useConnect } from '../../hooks/useConnect'
import { useConnectors } from '../../hooks/useConnectors'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/walletconnect.svg'

export function ConnectWalletConnectButton(props: ConnectWalletButtonProps) {
  const { onConnect, disabled, ...rest } = props
  const connect = useConnect()
  const { walletconnect: connector } = useConnectors()

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
      iconSrc={iconUrl}
      onClick={handleConnect}
    >
      WalletConnect
    </ConnectButton>
  )
}
