import { useCallback } from 'react'
import { useWalletConnect } from '../../hooks/useWalletConnect'
import { useWalletConnectors } from '../../hooks/useWalletConnectors'
import { MetaMaskCircle } from '@lidofinance/icons'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'

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
      icon={<MetaMaskCircle />}
      onClick={handleConnect}
      children="Metamask"
    />
  )
}
