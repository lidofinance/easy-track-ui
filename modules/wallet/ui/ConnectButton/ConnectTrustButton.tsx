import { useCallback } from 'react'
import { useWalletConnect } from '../../hooks/useWalletConnect'
import { useWalletConnectors } from '../../hooks/useWalletConnectors'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'
import { TrustCircle } from '@lidofinance/icons'
import { openWindow } from 'modules/shared/utils/openWindow'
import { isClientSide } from 'modules/shared/utils/isClientSide'

export function ConnectTrustButton(props: ConnectWalletButtonProps) {
  const { onConnect, ...rest } = props
  const connect = useWalletConnect()
  const { trust: connector } = useWalletConnectors()

  const openInWallet = useCallback(() => {
    const url = encodeURIComponent(window.location.href)
    openWindow(`https://link.trustwallet.com/open_url?url=${url}`)
  }, [])

  const handleConnect = useCallback(async () => {
    const hasInjected = isClientSide() && 'ethereum' in window

    if (!hasInjected) {
      openInWallet()
      return
    }

    onConnect?.()
    await connect(connector)
  }, [onConnect, connect, connector, openInWallet])

  return (
    <ConnectButton
      {...rest}
      icon={<TrustCircle />}
      onClick={handleConnect}
      children="Trust"
    />
  )
}
