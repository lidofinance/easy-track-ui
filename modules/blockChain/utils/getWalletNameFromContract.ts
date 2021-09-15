export function getWalletNameFromContract(contract: any): string | undefined {
  if (contract.provider.provider.isMetaMask) {
    return 'MetaMask'
  }

  return contract?.provider?.provider?.walletMeta?.name
}
