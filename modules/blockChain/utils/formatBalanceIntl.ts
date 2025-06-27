import { BigNumberish, ethers } from 'ethers'

export const weiToStr = (wei: ethers.BigNumberish) =>
  ethers.utils.formatEther(wei)

export const weiToNum = (wei: ethers.BigNumberish) => Number(weiToStr(wei))

const defaultFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumSignificantDigits: 3,
})

// Future replacement for utils/formatNumber
export const formatBalanceIntl = (
  amount: BigNumberish,
  maximumFractionDigits?: number,
) => {
  if (maximumFractionDigits !== undefined) {
    const customFormatter = new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits,
    })
    return customFormatter.format(weiToNum(amount))
  }

  return defaultFormatter.format(weiToNum(amount))
}
