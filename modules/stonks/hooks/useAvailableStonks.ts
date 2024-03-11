import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'
import { Stonks } from 'modules/blockChain/contractAddresses'
import { createContractHelpers } from 'modules/blockChain/utils/createContractHelpers'
import * as TypeChain from 'generated'
import { utils } from 'ethers'
import { StonksAbi } from 'generated'
import { useRouter } from 'next/router'

type StonksResult = {
  address: string
  contract: StonksAbi
}

export function useAvailableStonks() {
  const router = useRouter()
  const stonksAddress = String(router.query.stonksAddress)
  const { chainId, walletAddress } = useWeb3()
  const { data, initialLoading } = useSWR(
    walletAddress ? `available-stonks-${chainId}-${walletAddress}` : null,
    async () => {
      if (!walletAddress) {
        return
      }

      const contracts =
        stonksAddress && stonksAddress != 'undefined'
          ? [
              createContractHelpers({
                address: { [chainId]: stonksAddress },
                factory: TypeChain.StonksAbi__factory,
              }),
            ]
          : Stonks[chainId]?.map(address => {
              return createContractHelpers({
                address: { [chainId]: address },
                factory: TypeChain.StonksAbi__factory,
              })
            })

      if (!contracts) {
        return
      }

      return Promise.all(
        contracts.map(async stonks => {
          const stonksContract = stonks.connectRpc({ chainId })
          const managerAddress = await stonksContract.manager()

          if (
            utils.getAddress(managerAddress) !== utils.getAddress(walletAddress)
          ) {
            return null
          }

          return {
            contract: stonksContract,
            address: utils.getAddress(stonksContract.address),
          }
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
