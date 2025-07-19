import { useMemo } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import * as CONTRACT_ADDRESSES from 'modules/blockChain/contractAddresses'
import { useGovernanceTokenData } from 'modules/tokens/hooks/useGovernanceTokenData'

export function useLegoTokenOptions() {
  const { chainId } = useWeb3()
  const { data } = useGovernanceTokenData()
  return useMemo(
    () => [
      {
        label: 'ETH',
        value: '0x0000000000000000000000000000000000000000',
      },
      {
        label: data?.symbol || '',
        value: CONTRACT_ADDRESSES.GovernanceToken[chainId]!,
      },
      {
        label: 'stETH',
        value: CONTRACT_ADDRESSES.STETH[chainId]!,
      },
      {
        label: 'DAI',
        value: CONTRACT_ADDRESSES.DAI[chainId]!,
      },
    ],
    [data?.symbol, chainId],
  )
}
