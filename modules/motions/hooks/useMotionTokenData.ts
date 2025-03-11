import { DEFAULT_DECIMALS } from 'modules/blockChain/constants'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useConnectErc20Contract } from './useConnectErc20Contract'

export function useMotionTokenData(tokenAddress: string | null | undefined) {
  const { chainId } = useWeb3()
  const connectErc20Contract = useConnectErc20Contract()

  const { data: tokenData, initialLoading: isTokenDataLoading } = useSWR(
    tokenAddress?.length ? `token-data-${tokenAddress}-${chainId}` : null,
    async () => {
      if (!tokenAddress?.length) return null
      try {
        const tokenContract = connectErc20Contract(tokenAddress)
        const label = await tokenContract.symbol()
        const decimals = await tokenContract.decimals()

        return {
          label,
          address: tokenAddress,
          decimals,
        }
      } catch (error) {
        return {
          label: 'Unknown token',
          address: tokenAddress,
          decimals: DEFAULT_DECIMALS,
        }
      }
    },
  )
  return { tokenData, isTokenDataLoading }
}
