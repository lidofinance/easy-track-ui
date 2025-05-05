import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractAllowedTokensRegistry } from 'modules/blockChain/contracts'
import { useConnectErc20Contract } from './useConnectErc20Contract'
import { processInBatches } from 'modules/blockChain/utils/processInBatches'
import { MAX_PROVIDER_BATCH } from 'modules/blockChain/constants'

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

      const results = await processInBatches(
        tokensAddresses,
        MAX_PROVIDER_BATCH,
        async tokenAddress => {
          const tokenContract = connectErc20Contract(tokenAddress)

          const [label, decimals] = await Promise.all([
            tokenContract.symbol(),
            tokenContract.decimals(),
          ])

          return { address: tokenAddress, label, decimals }
        },
      )

      const allowedTokens = []
      const tokensDecimalsMap: Record<string, number | undefined> = {}

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const token = result.value
          allowedTokens.push(token)
          tokensDecimalsMap[token.address] = token.decimals
        } else {
          console.error('Failed to fetch token info:', result.reason)
        }
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
