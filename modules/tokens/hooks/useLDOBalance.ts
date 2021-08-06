import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useContractLDORpc } from 'modules/blockChain/hooks/useContractLdoToken'
import { useContractRpcSwr } from 'modules/blockChain/hooks/useContractRpcSwr'

export function useLDOBalance() {
  const { walletAddress } = useWalletInfo()
  const contractLdo = useContractLDORpc()
  return useContractRpcSwr(
    contractLdo,
    walletAddress ? 'balanceOf' : null,
    String(walletAddress),
  )
}
