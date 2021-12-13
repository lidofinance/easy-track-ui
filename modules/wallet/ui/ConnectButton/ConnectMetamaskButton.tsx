import { useCallback } from 'react'
import { useConnectorMetamask } from '@lido-sdk/web3-react'
import { MetaMaskCircle } from '@lidofinance/icons'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'

export function ConnectMetamaskButton(props: ConnectWalletButtonProps) {
  const { onConnect, disabled, ...rest } = props
  const { connect } = useConnectorMetamask()
  const isMetamaskInjected = !!(window as any).ethereum?.isMetaMask

  const handleConnect = useCallback(async () => {
    if (!isMetamaskInjected) return
    onConnect?.()
    await connect()
  }, [onConnect, connect, isMetamaskInjected])

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
