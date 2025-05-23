import { formatUnits } from 'ethers/lib/utils'
import { StonksOrderAbi__factory } from 'generated'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useConnectErc20Contract } from 'modules/motions/hooks/useConnectErc20Contract'
import { connectContractRpc } from 'modules/motions/utils/connectContractRpc'
import { useSWR } from 'modules/network/hooks/useSwr'
import moment from 'moment'
import { OrderDetailed, OrderStatus, OrderTransaction } from '../types'
import { fetchOffChainOrder } from '../utils/fetchOffChainOrder'
import { formatValue } from '../utils/formatValue'

export function useOrderData(orderAddress: string) {
  const { chainId } = useWeb3()
  const { getRpcUrl } = useConfig()
  const connectErc20Contract = useConnectErc20Contract()

  return useSWR<OrderDetailed | undefined>(
    orderAddress ? `order-data-${orderAddress}-${chainId}` : null,
    async () => {
      if (!orderAddress) return

      // fetch on-chain order data
      const orderContract = connectContractRpc(
        StonksOrderAbi__factory,
        orderAddress,
        chainId,
        getRpcUrl(chainId),
      )

      const [, sellToken, buyToken, sellAmountBn, buyAmountBn, validTo] =
        await orderContract.getOrderDetails()

      const sellAmountWei = sellAmountBn.toString()
      const buyAmountWei = buyAmountBn.toString()

      const isExpired = moment().isAfter(moment.unix(validTo))

      let status: OrderStatus = isExpired ? 'expired' : 'not-created'

      const stonks = await orderContract.stonks()
      const receiver = await orderContract.AGENT()

      const sellTokenContract = connectErc20Contract(sellToken)
      const sellTokenDecimals = await sellTokenContract.decimals()
      const sellTokenLabel = await sellTokenContract.symbol()
      const sellTokenBalance = await sellTokenContract.balanceOf(orderAddress)

      const buyTokenContract = connectErc20Contract(buyToken)
      const buyTokenDecimals = await buyTokenContract.decimals()
      const buyTokenLabel = await buyTokenContract.symbol()

      const sellAmount = formatValue(
        formatUnits(sellAmountBn, sellTokenDecimals),
      )
      const buyAmount = formatValue(formatUnits(buyAmountBn, buyTokenDecimals))

      const hasBalance = sellTokenBalance.gt(10) // Covers steth wei issue

      const isRecoverable = isExpired && hasBalance

      const recoverableAmount = isRecoverable
        ? formatValue(formatUnits(sellTokenBalance, sellTokenDecimals))
        : '0'

      let isCreatable = !isExpired && hasBalance

      // try to fetch off-chain order data
      const offChainOrder = await fetchOffChainOrder(orderAddress, chainId)
      let executedSellAmount = '0'
      let executedBuyAmount = '0'
      let sellAmountFulfillment = '0'
      let buyAmountFulfillment = '0'
      let transactions: OrderTransaction[] = []

      if (offChainOrder) {
        executedSellAmount = formatValue(
          formatUnits(offChainOrder.executedSellAmount, sellTokenDecimals),
        )
        executedBuyAmount = formatValue(
          formatUnits(offChainOrder.executedBuyAmount, buyTokenDecimals),
        )
        sellAmountFulfillment = formatValue(
          (parseInt(offChainOrder.executedSellAmount) /
            parseInt(sellAmountWei)) *
            100,
          2,
        )
        buyAmountFulfillment = formatValue(
          (parseInt(offChainOrder.executedBuyAmount) / parseInt(buyAmountWei)) *
            100,
          2,
        )

        status = offChainOrder.status
        isCreatable = false
        transactions = offChainOrder.transactions
      }

      return {
        address: orderAddress,
        stonks,
        status,
        receiver,
        validTo,
        sellAmount,
        buyAmount,
        sellToken,
        sellTokenLabel,
        buyToken,
        buyTokenLabel,
        executedSellAmount,
        executedBuyAmount,
        sellAmountFulfillment,
        buyAmountFulfillment,
        isRecoverable,
        recoverableAmount,
        isCreatable,
        uid: offChainOrder?.uid,
        creationDate: offChainOrder?.creationDate,
        sellAmountWei,
        buyAmountWei,
        transactions,
      }
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}
