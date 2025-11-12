import { utils } from 'ethers'
import { DEFAULT_DECIMALS } from 'modules/blockChain/constants'

export const validateTokenValue = (value: string, decimals: number) => {
  if (value.trim() === '') {
    return 'Invalid value'
  }
  if (value.includes('-')) {
    return 'Value must not be negative'
  }

  // Replace comma for locales where "," is decimal separator
  const normalized = value.replaceAll(',', '.')

  try {
    utils.parseUnits(normalized, decimals)
    return null
  } catch {
    return 'Unable to parse value'
  }
}

export const validateEtherValue = (value: string) =>
  validateTokenValue(value, DEFAULT_DECIMALS)
