import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { ContractLDO } from 'modules/blockChain/contracts'
import { useContractSwr } from 'modules/blockChain/hooks/useContractSwr'

export function useLDOBalance() {
  const { walletAddress } = useWalletInfo()
  const contractLdo = ContractLDO.useRpc()
  return useContractSwr(
    contractLdo,
    walletAddress ? 'balanceOf' : null,
    String(walletAddress),
  )
}
