import { BigNumber, utils } from 'ethers'

const formatter = new Intl.NumberFormat('en', {
  notation: 'standard',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export const formatBp = (value: BigNumber | number) => {
  const valueNum = typeof value === 'number' ? value : value.toNumber()
  return `${formatter.format(valueNum)} BP (${(valueNum * 0.01).toFixed(2)}%)`
}

export const formatShareLimit = (value: BigNumber) => {
  const formattedEtherValue = utils.formatEther(value)
  if (value.lt(utils.parseEther('0.01'))) {
    return formattedEtherValue
  }
  return formatter.format(parseInt(formattedEtherValue))
}

export const formatVaultParam = (value: BigNumber | number, isBp?: boolean) => {
  if (isBp) {
    return formatBp(value)
  }
  return formatShareLimit(value as BigNumber)
}
