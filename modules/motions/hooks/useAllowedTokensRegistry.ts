import { ContractAllowedTokensRegistry } from 'modules/blockChain/contracts'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { AllowedTokensRegistryAbi } from 'generated'
import { DAI } from 'modules/blockChain/contractAddresses'
import { connectERC20Contract } from '../utils/connectTokenContract'

export function useAllowedTokens() {
  const { chainId, library } = useWeb3()

  const { data, initialLoading } = useSWR(
    `allowed-tokens-${chainId}`,
    async () => {
      if (!library) {
        return
      }

      let registry: AllowedTokensRegistryAbi | undefined
      try {
        registry = ContractAllowedTokensRegistry.connectRpc({ chainId })
      } catch (error) {
        // Fallback for motions without registry support

        const address = DAI[chainId]
        if (!address) {
          return
        }

        const daiContract = connectERC20Contract(address, chainId)
        const decimals = await daiContract.decimals()

        return {
          allowedTokens: [
            {
              address,
              label: 'DAI',
              decimals,
            },
          ],
          decimalsMap: { [address]: decimals },
        }
      }
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
