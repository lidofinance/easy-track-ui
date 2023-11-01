import { constants, utils } from 'ethers'

export function validateAddress(value: string) {
  if (!utils.isAddress(value)) {
    return 'Address is not valid'
  }

  if (value.toLowerCase() === constants.AddressZero) {
    return 'Address must not be zero address'
  }
}
