import { useCallback } from 'react'
import { useWalletConnect } from '../../hooks/useWalletConnect'
import { useWalletConnectors } from '../../hooks/useWalletConnectors'
import { ConnectButton } from './ConnectButton'
import type { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/coinbase.svg'

export function ConnectCoinbaseButton(props: ConnectWalletButtonProps) {
  const { onConnect, disabled, ...rest } = props
  const connect = useWalletConnect()
  const { coinbase: connector } = useWalletConnectors()

  const handleConnect = useCallback(async () => {
    if (!connector) return
    onConnect?.()
    await connect(connector)
  }, [connect, connector, onConnect])

  return (
    <ConnectButton
      {...rest}
      disabled={!connector || disabled}
      iconSrc={iconUrl}
      onClick={handleConnect}
      children="Coinbase Wallet"
    />
  )
}
