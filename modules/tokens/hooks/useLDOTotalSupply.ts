import { ContractLDO } from 'modules/blockChain/contracts'

export function useLDOTotalSupply() {
  return ContractLDO.useSwrRpc('totalSupply')
}
