import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractAllowedTokensRegistry } from 'modules/blockChain/contracts'
import { useConnectErc20Contract } from './useConnectErc20Contract'

export function useAllowedTokens() {
  const { chainId, library } = useWeb3()
  const connectErc20Contract = useConnectErc20Contract()
  const tokenRegistry = ContractAllowedTokensRegistry.useRpc()

  const { data, initialLoading } = useSWR(
    `allowed-tokens-${chainId}`,
    async () => {
      if (!library) {
        return
      }
      const tokensAddresses = await tokenRegistry.getAllowedTokens()

      const allowedTokens = await Promise.all(
        tokensAddresses.map(async tokenAddress => {
          const tokenContract = connectErc20Contract(tokenAddress)

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
