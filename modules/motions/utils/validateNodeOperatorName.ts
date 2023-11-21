import { BigNumber } from 'ethers'

export function validateNodeOperatorName(
  value: string,
  maxNameLength: BigNumber | undefined,
) {
  try {
    if (!value.trim().length) {
      return 'Name must not be empty'
    }

    if (maxNameLength?.lt(value.length)) {
      return `Name length must be less or equal than ${maxNameLength} characters`
    }
  } catch (error) {
    return 'Unable to parse value'
  }
}
