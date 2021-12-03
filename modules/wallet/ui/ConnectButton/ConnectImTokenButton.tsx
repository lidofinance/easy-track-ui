import { useCallback } from 'react'
import { useConnectorImToken } from '@lido-sdk/web3-react'
import { ConnectButton } from './ConnectButton'
import type { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/imtoken.svg'

export function ConnectImTokenButton(props: ConnectWalletButtonProps) {
  const { onConnect, ...rest } = props
  const { connect } = useConnectorImToken()

  const handleConnect = useCallback(async () => {
    onConnect?.()
    await connect?.()
  }, [onConnect, connect])

  return (
    <ConnectButton
      {...rest}
      iconSrc={iconUrl}
      onClick={handleConnect}
      children="imToken"
    />
  )
}
