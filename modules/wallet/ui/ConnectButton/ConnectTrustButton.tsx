import { useCallback } from 'react'
import { useConnect } from '../../hooks/useConnect'
import { useConnectors } from '../../hooks/useConnectors'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/trust.svg'
import { openWindow } from 'modules/utils/openWindow'
import { isClientSide } from 'modules/utils/isClientSide'

export function ConnectTrustButton(props: ConnectWalletButtonProps) {
  const { onConnect, ...rest } = props
  const connect = useConnect()
  const { trust: connector } = useConnectors()

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
      iconSrc={iconUrl}
      onClick={handleConnect}
      children="Trust"
    />
  )
}
