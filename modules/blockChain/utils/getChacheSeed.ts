import { createHash } from 'crypto'

export const getCacheSeed = (label: string | undefined): number => {
  if (!label) return 0

  // Hash the label using SHA-256 and take the first 8 characters
  const hash = createHash('sha256').update(label).digest('hex').slice(0, 8)

  // Convert the hex to a number
  return parseInt(hash, 16)
}
