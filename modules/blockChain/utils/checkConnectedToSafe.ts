import { getWalletNameFromProvider } from './getWalletNameFromProvider'

export function checkConnectedToSafe(provider: any) {
  const walletName = getWalletNameFromProvider(provider)
  return Boolean(walletName?.startsWith('Gnosis Safe'))

  //
  //
  // https://github.com/gnosis/contract-proxy-kit/issues/127#issuecomment-724979168
  // const provider = contract.provider.provider
  // const wc =
  //   (await provider.getWalletConnector?.()) ||
  //   (await provider.connection?.getWalletConnector?.()) ||
  //   provider.wc ||
  //   provider.connection?.wc

  // if (wc?.peerMeta?.name?.startsWith?.('Gnosis Safe')) {
  //   return true
  // }

  // if (provider._providers) {
  //   return (
  //     await Promise.all(provider._providers.map(checkConnectedToSafe))
  //   ).includes(true)
  // }

  // return false
}
