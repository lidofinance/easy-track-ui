import { useCallback } from 'react'
import { useConnectorCoinbase } from '@lido-sdk/web3-react'
import { ConnectButton } from './ConnectButton'
import type { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/coinbase.svg'

export function ConnectCoinbaseButton(props: ConnectWalletButtonProps) {
  const { onConnect, ...rest } = props
  const { connect } = useConnectorCoinbase()

  const handleConnect = useCallback(async () => {
    onConnect?.()
    await connect()
  }, [onConnect, connect])

  return (
    <ConnectButton
      {...rest}
      iconSrc={iconUrl}
      onClick={handleConnect}
      children="Coinbase Wallet"
    />
  )
}
