import { useCallback } from 'react'
import { useWalletConnect } from '../../hooks/useWalletConnect'
import { useWalletConnectors } from '../../hooks/useWalletConnectors'
import { Coinbase } from '@lidofinance/icons'
import { ConnectButton } from './ConnectButton'
import type { ConnectWalletButtonProps } from './types'

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
      icon={<Coinbase />}
      onClick={handleConnect}
      children="Coinbase Wallet"
    />
  )
}
