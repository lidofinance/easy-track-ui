import { useCallback } from 'react'
import { useConnectorWalletConnect } from '@lido-sdk/web3-react'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/walletconnect.svg'

export function ConnectWalletConnectButton(props: ConnectWalletButtonProps) {
  const { onConnect, ...rest } = props
  const { connect } = useConnectorWalletConnect()

  const handleConnect = useCallback(async () => {
    onConnect?.()
    await connect()
  }, [onConnect, connect])

  return (
    <ConnectButton
      {...rest}
      iconSrc={iconUrl}
      onClick={handleConnect}
      children="WalletConnect"
    />
  )
}
