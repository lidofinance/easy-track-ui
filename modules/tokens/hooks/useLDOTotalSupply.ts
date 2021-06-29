import { useTokenRpcSwr } from './useTokenRpcSwr'
import { TOKENS } from '../tokens'

export function useLDOTotalSupply() {
  return useTokenRpcSwr(TOKENS.ldo, 'totalSupply')
}
