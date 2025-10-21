import { BigNumber, utils } from 'ethers'

const formatter = new Intl.NumberFormat('en', {
  notation: 'standard',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export const formatVaultParam = (value: BigNumber, isBp?: boolean) => {
  if (isBp) {
    return formatter.format(value.toNumber())
  }

  const formattedEtherValue = utils.formatEther(value)
  if (value.lt(utils.parseEther('0.01'))) {
    return formattedEtherValue
  }
  return formatter.format(parseInt(formattedEtherValue))
}
