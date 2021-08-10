import { ContractLDO } from 'modules/blockChain/contracts'
import { useContractSwr } from 'modules/blockChain/hooks/useContractSwr'

export function useLDOTotalSupply() {
  const contractLdo = ContractLDO.useRpc()
  return useContractSwr(contractLdo, 'totalSupply')
}
