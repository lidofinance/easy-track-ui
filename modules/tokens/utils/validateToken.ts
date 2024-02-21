import { utils } from 'ethers'
import { DEFAULT_DECIMALS } from 'modules/blockChain/constants'

export const validateToken = (value: string, decimals = DEFAULT_DECIMALS) => {
  if (Number(value) <= 0) {
    return 'Value must be positive'
  }
  try {
    utils.parseUnits(value, decimals)
    return null
  } catch (_) {
    return 'Unable to parse value'
  }
}
