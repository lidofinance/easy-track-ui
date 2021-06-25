import { useCallback } from 'react'
import { useWalletConnect } from '../../hooks/useWalletConnect'
import { useWalletConnectors } from '../../hooks/useWalletConnectors'
import { ConnectButton } from './ConnectButton'
import type { ConnectWalletButtonProps } from './types'
import iconUrl from 'assets/icons/imtoken.svg'
import { openWindow } from 'modules/shared/utils/openWindow'
import { isClientSide } from 'modules/shared/utils/isClientSide'

export function ConnectImTokenButton(props: ConnectWalletButtonProps) {
  const { onConnect, ...rest } = props
  const connect = useWalletConnect()
  const { imtoken: connector } = useWalletConnectors()

  const openInWallet = useCallback(() => {
    const url = encodeURIComponent(window.location.href)
    openWindow(`imtokenv2://navigate?screen=DappView&url=${url}`)
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
      children="imToken"
    />
  )
}
