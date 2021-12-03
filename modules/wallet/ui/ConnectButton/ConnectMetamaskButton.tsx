import { useCallback } from 'react'
import { useConnectorInfo } from '@lido-sdk/web3-react'
import { useWalletConnect } from '../../hooks/useWalletConnect'
import { useWalletConnectors } from '../../hooks/useWalletConnectors'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/metamask.svg'

export function ConnectMetamaskButton(props: ConnectWalletButtonProps) {
  const { onConnect, disabled, ...rest } = props
  const connect = useWalletConnect()
  const { isMetamask } = useConnectorInfo()
  const { metamask: connector } = useWalletConnectors()

  const handleConnect = useCallback(async () => {
    if (!isMetamask) return
    onConnect?.()
    await connect(connector)
  }, [isMetamask, onConnect, connect, connector])

  return (
    <ConnectButton
      {...rest}
      disabled={!isMetamask || disabled}
      iconSrc={iconUrl}
      onClick={handleConnect}
      children="Metamask"
    />
  )
}
