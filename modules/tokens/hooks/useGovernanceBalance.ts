import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { ContractGovernanceToken } from 'modules/blockChain/contracts'

export function useGovernanceBalance() {
  const { walletAddress } = useWalletInfo()
  return ContractGovernanceToken.useSwrWeb3(
    walletAddress ? 'balanceOf' : null,
    String(walletAddress),
  )
}
