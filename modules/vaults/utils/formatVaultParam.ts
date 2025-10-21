import { BigNumber, ethers } from 'ethers'

const formatter = new Intl.NumberFormat('en', {
  notation: 'standard',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export const formatVaultParam = (value: BigNumber, isBp?: boolean) => {
  if (isBp) {
    return formatter.format(value.toNumber())
  }
  return formatter.format(parseInt(ethers.utils.formatEther(value)))
}
