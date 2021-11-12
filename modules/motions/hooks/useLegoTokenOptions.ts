import { useMemo } from 'react'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'
import * as CONTRACT_ADDRESSES from 'modules/blockChain/contractAddresses'

export function useLegoTokenOptions() {
  const chainId = useCurrentChain()
  const { data: governanceSymbol } = useGovernanceSymbol()
  return useMemo(
    () => [
      {
        label: 'ETH',
        value: '0x0000000000000000000000000000000000000000',
      },
      {
        label: governanceSymbol || '',
        value: CONTRACT_ADDRESSES.GovernanceToken[chainId],
      },
      {
        label: 'stETH',
        value: CONTRACT_ADDRESSES.STETH[chainId],
      },
    ],
    [governanceSymbol, chainId],
  )
}
