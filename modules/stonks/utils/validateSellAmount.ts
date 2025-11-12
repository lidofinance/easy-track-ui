import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { validateTokenValue } from 'modules/motions/utils/validateEtherValue'
import { MIN_POSSIBLE_BALANCE } from '../constants'

export const validateSellAmount = (
  value: string,
  tokenFromDecimals: number,
  currentBalance: BigNumber,
) => {
  const tokenError = validateTokenValue(value, tokenFromDecimals)
  if (tokenError) {
    return tokenError
  }

  const valueBn = parseUnits(value, tokenFromDecimals)

  if (valueBn.lte(0)) {
    return 'Value must be greater than zero'
  }

  if (valueBn.lt(MIN_POSSIBLE_BALANCE)) {
    return `Minimal possible balance is ${MIN_POSSIBLE_BALANCE} wei`
  }

  if (valueBn.gt(currentBalance)) {
    return 'Sell amount exceeds available balance'
  }

  return true
}
