import { ContractGovernanceToken } from 'modules/blockChain/contracts'

export function useGovernanceSymbol() {
  return ContractGovernanceToken.useSwrWeb3('symbol', [])
}
