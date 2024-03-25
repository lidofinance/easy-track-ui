import { BigNumber } from 'ethers'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'
import { connectERC20Contract } from 'modules/motions/utils/connectTokenContract'
import { formatUnits } from 'ethers/lib/utils'
import { useAvailableStonks } from './useAvailableStonks'
import { useRouter } from 'next/router'

const minimalBalance = 10

export function useStonksData() {
  const { chainId } = useWeb3()
  const router = useRouter()
  const stonksAddress = String(router.query.stonksAddress)
  const { availableStonks, initialLoading: isAvailableStonksDataLoading } =
    useAvailableStonks()

  const { data: stonksData, initialLoading: isStonksDataLoading } = useSWR(
    availableStonks?.length ? `stonks-data-${chainId}-${stonksAddress}` : null,
    async () => {
      if (!availableStonks?.length) {
        return
      }

      const processedStonks = await Promise.all(
        availableStonks.map(async stonks => {
          const [tokenFrom, tokenTo, orderDurationInSeconds] =
            await stonks.contract.getOrderParameters()
          const marginInBasisPoints =
            await stonks.contract.MARGIN_IN_BASIS_POINTS()
          const priceToleranceInBasisPoints =
            await stonks.contract.PRICE_TOLERANCE_IN_BASIS_POINTS()
          const tokenFromContract = connectERC20Contract(tokenFrom, chainId)

          const currentBalance = await tokenFromContract.balanceOf(
            stonks.address,
          )

          const tokenFromDecimals = await tokenFromContract.decimals()
          const tokenFromLabel = await tokenFromContract.symbol()
          const tokenToContract = connectERC20Contract(tokenTo, chainId)

          const tokenToLabel = await tokenToContract.symbol()
          const tokenToDecimals = await tokenToContract.decimals()

          let expectedOutput = BigNumber.from(0)

          const isEnoughBalance = currentBalance.gt(minimalBalance)

          if (isEnoughBalance) {
            expectedOutput =
              await stonks.contract.estimateTradeOutputFromCurrentBalance()
          }

          return {
            address: stonks.address,
            tokenFrom: {
              label: tokenFromLabel,
              address: tokenFrom,
            },
            tokenTo: {
              label: tokenToLabel,
              address: tokenTo,
            },
            marginInBasisPoints: marginInBasisPoints.toNumber(),
            orderDurationInSeconds: orderDurationInSeconds.toNumber(),
            priceToleranceInBasisPoints: priceToleranceInBasisPoints.toNumber(),
            currentBalance: isEnoughBalance
              ? formatUnits(currentBalance, tokenFromDecimals)
              : '0',
            expectedOutput: Number(
              formatUnits(expectedOutput, tokenToDecimals),
            ),
            tokenToDecimals: tokenToDecimals,
          }
        }),
      )

      return processedStonks.sort(
        (a, b) => parseFloat(b.currentBalance) - parseFloat(a.currentBalance),
      )
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  return {
    stonksData,
    isStonksDataLoading: isAvailableStonksDataLoading || isStonksDataLoading,
  }
}
