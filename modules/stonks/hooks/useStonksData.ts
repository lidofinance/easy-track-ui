import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'
import { connectERC20Contract } from 'modules/motions/utils/connectTokenContract'
import { formatUnits } from 'ethers/lib/utils'
import { useAvailableStonks } from './useAvailableStonks'

type StonksData = {
  address: string
  tokenFrom: {
    label: string
    address: string
  }
  tokenTo: {
    label: string
    address: string
  }
  marginInBasisPoints: number
  orderDurationInSeconds: number
  priceToleranceInBasisPoints: number
  currentBalance: string
  expectedOutput: string
}

export function useStonksData() {
  const { chainId } = useWeb3()
  const { availableStonks } = useAvailableStonks()

  return useSWR(
    availableStonks?.length ? `stonks-data-${chainId}` : null,
    async () => {
      if (!availableStonks?.length) {
        return
      }

      return Promise.all(
        availableStonks.map(async stonks => {
          const stonksParams = await stonks.contract.getOrderParameters()
          const tokenFromContract = connectERC20Contract(
            stonksParams.tokenFrom,
            chainId,
          )

          const currentBalance = await tokenFromContract.balanceOf(
            stonks.address,
          )

          if (currentBalance.isZero()) {
            return null
          }

          const tokenFromDecimals = await tokenFromContract.decimals()
          const tokenFromLabel = await tokenFromContract.symbol()
          const tokenToContract = connectERC20Contract(
            stonksParams.tokenTo,
            chainId,
          )

          const tokenToLabel = await tokenToContract.symbol()
          const tokenToDecimals = await tokenToContract.decimals()

          const expectedOutput =
            await stonks.contract.estimateOutputFromCurrentBalance()

          return {
            address: stonks.address,
            tokenFrom: {
              label: tokenFromLabel,
              address: stonksParams.tokenFrom,
            },
            tokenTo: {
              label: tokenToLabel,
              address: stonksParams.tokenTo,
            },
            marginInBasisPoints: stonksParams.marginInBasisPoints.toNumber(),
            orderDurationInSeconds:
              stonksParams.orderDurationInSeconds.toNumber(),
            priceToleranceInBasisPoints:
              stonksParams.priceToleranceInBasisPoints.toNumber(),
            currentBalance: formatUnits(currentBalance, tokenFromDecimals),
            expectedOutput: formatUnits(expectedOutput, tokenToDecimals),
          }
        }),
      ).then(stonks => stonks.filter(Boolean)) as Promise<StonksData[]>
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )
}
