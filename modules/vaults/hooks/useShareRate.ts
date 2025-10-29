import { utils } from 'ethers'
import { ContractSteth } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'

export const useShareRate = (isEnabled = true) => {
  const { chainId } = useWeb3()
  const stEthContract = ContractSteth.useRpc()
  return useSWR(
    isEnabled ? `share-limit-rate-${chainId}` : null,
    async () => {
      if (!isEnabled) return
      const rate = await stEthContract.getPooledEthByShares(
        utils.parseEther('1'),
      )
      return rate
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}
