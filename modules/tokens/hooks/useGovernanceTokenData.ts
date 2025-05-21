import { useLidoSWRImmutable } from '@lido-sdk/react'
import { ContractGovernanceToken } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

export function useGovernanceTokenData() {
  const { chainId } = useWeb3()
  const ldo = ContractGovernanceToken.useRpc()

  return useLidoSWRImmutable(`governance-token-data-${chainId}`, async () => {
    const totalSupply = await ldo.totalSupply()
    const symbol = await ldo.symbol()

    return {
      totalSupply,
      symbol,
    }
  })
}
