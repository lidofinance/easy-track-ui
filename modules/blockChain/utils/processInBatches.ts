export const processInBatches = async <T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<R>,
) => {
  const results = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(batch.map(fn))
    results.push(...batchResults)
  }
  return results
}
