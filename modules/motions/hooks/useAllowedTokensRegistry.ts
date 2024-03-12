import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { connectERC20Contract } from '../utils/connectTokenContract'
import { ContractAllowedTokensRegistry } from 'modules/blockChain/contracts'

export function useAllowedTokens() {
  const { chainId, library } = useWeb3()

  const { data, initialLoading } = useSWR(
    `allowed-tokens-${chainId}`,
    async () => {
      if (!library) {
        return
      }
      const registry = ContractAllowedTokensRegistry.connectRpc({ chainId })
      const tokensAddresses = await registry.getAllowedTokens()

      const allowedTokens = await Promise.all(
        tokensAddresses.map(async tokenAddress => {
          const tokenContract = connectERC20Contract(tokenAddress, chainId)

          const label = await tokenContract.symbol()
          const decimals = await tokenContract.decimals()

          return { address: tokenAddress, label, decimals }
        }),
      )

      const tokensDecimalsMap: Record<string, number | undefined> = {}

      for (const token of allowedTokens) {
        tokensDecimalsMap[token.address] = token.decimals
      }

      return { allowedTokens, tokensDecimalsMap }
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  return {
    allowedTokens: data?.allowedTokens,
    tokensDecimalsMap: data?.tokensDecimalsMap,
    initialLoading,
  }
}
