import { useCallback } from 'react'
import { useWalletConnect } from '../../hooks/useWalletConnect'
import { useWalletConnectors } from '../../hooks/useWalletConnectors'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/metamask.svg'

export function ConnectMetamaskButton(props: ConnectWalletButtonProps) {
  const { onConnect, disabled, ...rest } = props
  const connect = useWalletConnect()
  const isMetamaskInjected = !!(window as any).ethereum?.isMetaMask
  const { metamask: connector } = useWalletConnectors()

  const handleConnect = useCallback(async () => {
    if (!isMetamaskInjected) return
    onConnect?.()
    await connect(connector)
  }, [isMetamaskInjected, onConnect, connect, connector])

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
