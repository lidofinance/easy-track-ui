import { createHash } from 'crypto'

// Creates a cache seed for the batch provider based on the label
// This is used to separate batch provider object instances and avoid batching of requests
// with different labels that sometimes can happen if one instance is being used in multiple places, causing limit exceeded errors
export const getBatchProviderCacheSeed = (
  label: string | undefined,
): number => {
  if (!label) return 0

  // Hash the label using SHA-256 and take the first 8 characters
  const hash = createHash('sha256').update(label).digest('hex').slice(0, 8)

  // Convert the hex to a number
  return parseInt(hash, 16)
}
