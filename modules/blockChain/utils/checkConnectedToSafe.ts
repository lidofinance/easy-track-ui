export function checkConnectedToSafe(provider: any) {
  return (
    provider?.provider?.connector?.peerMeta?.name === 'WalletConnect Safe App'
  )
}
