import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { ContractLDO } from 'modules/blockChain/contracts'

export function useLDOBalance() {
  const { walletAddress } = useWalletInfo()
  return ContractLDO.useSwrWeb3(
    walletAddress ? 'balanceOf' : null,
    String(walletAddress),
  )
}
