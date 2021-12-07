import { useCallback } from 'react'
import { useConnectorMetamask } from '@lido-sdk/web3-react'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/metamask.svg'

export function ConnectMetamaskButton(props: ConnectWalletButtonProps) {
  const { onConnect, disabled, ...rest } = props
  const { connect } = useConnectorMetamask()
  const isMetamaskInjected = !!(window as any).ethereum?.isMetaMask

  const handleConnect = useCallback(async () => {
    if (!isMetamaskInjected) return
    onConnect?.()
    await connect()
  }, [isMetamaskInjected, onConnect, connect])

  return (
    <ConnectButton
      {...rest}
      disabled={!isMetamaskInjected || disabled}
      iconSrc={iconUrl}
      onClick={handleConnect}
      children="Metamask"
    />
  )
}
