import { useCallback } from 'react'
import { useConnectorTrust } from '@lido-sdk/web3-react'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/trust.svg'

export function ConnectTrustButton(props: ConnectWalletButtonProps) {
  const { onConnect, ...rest } = props
  const { connect } = useConnectorTrust()

  const handleConnect = useCallback(async () => {
    onConnect?.()
    await connect?.()
  }, [onConnect, connect])

  return (
    <ConnectButton
      {...rest}
      iconSrc={iconUrl}
      onClick={handleConnect}
      children="Trust"
    />
  )
}
