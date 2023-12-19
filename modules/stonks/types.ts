export type Order = {
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
