import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'
import { STONKS_CONTRACTS } from '../constants'
import { utils } from 'ethers'

type StonksResult = typeof STONKS_CONTRACTS[number]

export function useAvailableStonks() {
  const { chainId, walletAddress } = useWeb3()
  const { data, initialLoading } = useSWR(
    walletAddress ? `available-stonks-${chainId}-${walletAddress}` : null,
    async () => {
      if (!walletAddress) {
        return
      }

      return Promise.all(
        STONKS_CONTRACTS.map(async stonks => {
          const stonksContract = stonks.connectRpc({ chainId })
          const managerAddress = await stonksContract.manager()

          if (
            utils.getAddress(managerAddress) !== utils.getAddress(walletAddress)
          ) {
            return null
          }
          return stonks
        }),
      ).then(stonks => stonks.filter(Boolean)) as Promise<StonksResult[]>
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  )

  return {
    availableStonks: data,
    areStonksAvailable: !initialLoading && data && data.length > 0,
    initialLoading,
  }
}
