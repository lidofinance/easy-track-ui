import { utils } from 'ethers'

export const validateUintValue = (value: string | undefined) => {
  try {
    const parsedValue = utils.parseEther(value ?? '')
    if (parsedValue.isNegative()) {
      return 'Value must not be negative'
    }
  } catch (error) {
    return 'Unable to parse value'
  }
}