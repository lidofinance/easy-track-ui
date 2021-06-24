import { BigNumber } from '@ethersproject/bignumber'

type ReduceForSlippage = (amount: BigNumber, slippageRatio: number) => BigNumber

const PRECISION = 5

export const reduceForSlippage: ReduceForSlippage = (amount, slippageRatio) => {
  if (slippageRatio < 0 || slippageRatio > 1) {
    throw new Error('Slippage ratio is out of range')
  }

  const multiplier = 10 ** PRECISION
  return amount
    .mul(Math.floor((1 - slippageRatio) * multiplier))
    .div(multiplier)
}
