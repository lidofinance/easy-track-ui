import { BigNumber } from 'ethers'

export type OrderFromReceipt = {
  address: string
  hash: string
  orderData: {
    sellToken: string
    buyToken: string
    receiver: string
    sellAmount: string
    buyAmount: string
    validTo: number
    feeAmount: string
    kind: string
    partiallyFillable: boolean
    sellTokenBalance: string
    buyTokenBalance: string
    appData: string
  }
}

type OffChainOrderStatus =
  | 'presignaturePending'
  | 'open'
  | 'fulfilled'
  | 'cancelled'
  | 'expired'

export type OrderStatus = 'not-created' | OffChainOrderStatus

export type OrderTransaction = {
  txHash: string
}

export type OffChainOrder = {
  creationDate: string
  owner: string
  uid: string
  validTo: number
  sellToken: string
  buyToken: string
  sellAmount: string
  buyAmount: string
  executedSellAmount: string
  executedBuyAmount: string
  receiver: string
  status: OffChainOrderStatus
  transactions: OrderTransaction[]
}

export type OrderDetailed = {
  // available on-chain
  address: string
  stonks: string
  status: OrderStatus
  receiver: string
  validTo: number
  sellAmount: string
  buyAmount: string
  sellToken: string
  sellTokenLabel: string
  buyToken: string
  buyTokenLabel: string
  isRecoverable: boolean
  recoverableAmount: string
  isCreatable: boolean
  sellAmountWei: string
  buyAmountWei: string
  // available off-chain
  uid?: string
  creationDate?: string
  executedSellAmount?: string
  executedBuyAmount?: string
  sellAmountFulfillment?: string
  buyAmountFulfillment?: string
  transactions?: OrderTransaction[]
}

export type StonksData = {
  address: string
  tokenFrom: {
    label: string
    address: string
    decimals: number
  }
  tokenTo: {
    label: string
    address: string
    decimals: number
  }
  marginBP: BigNumber
  priceToleranceBP: BigNumber
  orderDurationInSeconds: number
  currentBalance: BigNumber
  version: 'v1' | 'v2'
}
