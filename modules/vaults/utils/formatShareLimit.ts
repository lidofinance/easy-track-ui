import { BigNumber, utils } from 'ethers'

export const formatShareLimit = (value: BigNumber) => {
  const formatted = utils.formatEther(value)

  const num = parseFloat(formatted)

  if (Number.isInteger(num)) {
    return num.toString()
  }

  return formatted
}
