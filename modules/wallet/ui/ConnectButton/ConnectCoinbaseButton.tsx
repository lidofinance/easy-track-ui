import { useCallback } from 'react'
import { useConnect } from '../../hooks/useConnect'
import { useConnectors } from '../../hooks/useConnectors'
import { ConnectButton } from './ConnectButton'
import type { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/coinbase.svg'

export function ConnectCoinbaseButton(props: ConnectWalletButtonProps) {
  const { onConnect, disabled, ...rest } = props
  const connect = useConnect()
  const { coinbase: connector } = useConnectors()

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
