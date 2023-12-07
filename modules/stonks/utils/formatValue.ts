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
