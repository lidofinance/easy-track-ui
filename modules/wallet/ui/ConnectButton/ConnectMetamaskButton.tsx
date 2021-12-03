import { useCallback } from 'react'
import { useConnectorMetamask } from '@lido-sdk/web3-react'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/metamask.svg'

export function ConnectMetamaskButton(props: ConnectWalletButtonProps) {
  const { onConnect, ...rest } = props
  const { connect } = useConnectorMetamask()

  const handleConnect = useCallback(async () => {
    onConnect?.()
    await connect()
  }, [onConnect, connect])

  return (
    <ConnectButton
      {...rest}
      iconSrc={iconUrl}
      onClick={handleConnect}
      children="Metamask"
    />
  )
}
