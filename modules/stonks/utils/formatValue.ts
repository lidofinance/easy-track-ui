import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

export function formatValue(
  value: string | number | null | undefined,
  maxDigits = 4,
): string {
  if (value === null || value === undefined) return 'N/A'
  const num = Number(value)

  if (isNaN(num)) {
    return 'N/A'
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
  })
}

export const formatValueBn = (
  value: BigNumber,
  decimals: number,
  maxDigits = 4,
): string => {
  return formatValue(formatUnits(value, decimals), maxDigits)
}
