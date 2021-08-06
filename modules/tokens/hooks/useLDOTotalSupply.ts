import { useContractLDORpc } from 'modules/blockChain/hooks/useContractLdoToken'
import { useContractRpcSwr } from 'modules/blockChain/hooks/useContractRpcSwr'

export function useLDOTotalSupply() {
  const contractLdo = useContractLDORpc()
  return useContractRpcSwr(contractLdo, 'totalSupply')
}
