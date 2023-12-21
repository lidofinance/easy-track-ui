import type { TransactionReceipt } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import { StonksOrderAbi__factory } from 'generated'
import { OrderFromReceipt } from '../types'

type OrderLog = {
  args: {
    order: string
    orderHash: string
    orderData: {
      sellToken: string
      buyToken: string
      receiver: string
      sellAmount: BigNumber
      buyAmount: BigNumber
      validTo: number
      appData: string
      feeAmount: BigNumber
      kind: string
      partiallyFillable: boolean
      sellTokenBalance: string
      buyTokenBalance: string
    }
  }
}

export const getOrderByPlaceTxReceipt = (
  receipt: TransactionReceipt,
): OrderFromReceipt => {
  const orderInterface = StonksOrderAbi__factory.createInterface()

  const parsedLogs = []

  for (const rawLog of receipt.logs) {
    try {
      parsedLogs.push(orderInterface.parseLog(rawLog))
    } catch (error) {}
  }

  const orderCreatedLog = parsedLogs.find(
    log => log.name === 'OrderCreated',
  ) as OrderLog | undefined

  if (!orderCreatedLog) {
    throw new Error('Unable to extract order from transaction')
  }

  const { orderData } = orderCreatedLog.args

  return {
    address: orderCreatedLog.args.order,
    hash: orderCreatedLog.args.orderHash,
    orderData: {
      sellToken: orderData.sellToken,
      buyToken: orderData.buyToken,
      receiver: orderData.receiver,
      sellAmount: orderData.sellAmount.toString(),
      buyAmount: orderData.buyAmount.toString(),
      validTo: orderData.validTo,
      // feeAmount is always 0 by design
      feeAmount: orderData.feeAmount.toString(),
      kind: orderData.kind,
      partiallyFillable: orderData.partiallyFillable,
      sellTokenBalance: orderData.sellTokenBalance,
      buyTokenBalance: orderData.buyTokenBalance,
      appData: orderData.appData,
    },
  }
}
