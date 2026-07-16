import { BigNumber } from 'ethers'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useAvailableStonks } from './useAvailableStonks'
import { useConnectErc20Contract } from 'modules/motions/hooks/useConnectErc20Contract'
import { MIN_POSSIBLE_BALANCE } from '../constants'
import { StonksData } from '../types'
import { getStonksVersion } from '../utils/getStonksVersion'

export function useStonksData(stonksAddress?: string) {
  const { chainId } = useWeb3()
  const connectErc20Contract = useConnectErc20Contract()
  const { availableStonks, initialLoading: isAvailableStonksDataLoading } =
    useAvailableStonks()

  const stonksList = stonksAddress
    ? availableStonks?.filter(
        stonks => stonks.address.toLowerCase() === stonksAddress.toLowerCase(),
      )
    : availableStonks

  const { data: stonksData, initialLoading: isStonksDataLoading } = useSWR<
    StonksData[] | undefined
  >(
    stonksList?.length
      ? `stonks-data-${chainId}-${stonksList
          .map(({ address }) => address)
          .join('-')}`
      : null,
    async () => {
      if (!stonksList?.length) {
        return
      }

      const processedStonks = await Promise.all(
        stonksList.map(async stonks => {
          const [tokenFrom, tokenTo, orderDurationInSeconds] =
            await stonks.contract.getOrderParameters()

          const tokenFromContract = connectErc20Contract(tokenFrom)
          const tokenToContract = connectErc20Contract(tokenTo)

          const [
            marginBP,
            priceToleranceBP,
            tokenFromBalance,
            tokenFromDecimals,
            tokenFromLabel,
            tokenToLabel,
            tokenToDecimals,
            version,
          ] = await Promise.all([
            stonks.contract.MARGIN_IN_BASIS_POINTS(),
            stonks.contract.PRICE_TOLERANCE_IN_BASIS_POINTS(),
            tokenFromContract.balanceOf(stonks.address),
            tokenFromContract.decimals(),
            tokenFromContract.symbol(),
            tokenToContract.symbol(),
            tokenToContract.decimals(),
            getStonksVersion(stonks.contract),
          ])

          let balanceAdjustedToMinimal = tokenFromBalance
          if (tokenFromBalance.lt(BigNumber.from(MIN_POSSIBLE_BALANCE))) {
            balanceAdjustedToMinimal = BigNumber.from(0)
          }

          return {
            address: stonks.address,
            tokenFrom: {
              label: tokenFromLabel,
              address: tokenFrom,
              decimals: tokenFromDecimals,
            },
            tokenTo: {
              label: tokenToLabel,
              address: tokenTo,
              decimals: tokenToDecimals,
            },
            marginBP,
            priceToleranceBP,
            orderDurationInSeconds: orderDurationInSeconds.toNumber(),
            currentBalance: balanceAdjustedToMinimal,
            version,
          }
        }),
      )

      return processedStonks.sort((a, b) =>
        b.currentBalance.sub(a.currentBalance).toNumber(),
      )
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return {
    stonksData,
    isStonksDataLoading: isAvailableStonksDataLoading || isStonksDataLoading,
  }
}
