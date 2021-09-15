import { getWalletNameFromContract } from './getWalletNameFromContract'

export function checkConnectedToSafe(contract: any) {
  return Boolean(getWalletNameFromContract(contract)?.startsWith('Gnosis Safe'))

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
