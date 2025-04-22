import { MAX_ETH_GET_LOGS_RANGE } from 'config'
import { Cache } from 'memory-cache'

const ONE_BIGINT = BigInt(1)

export const batchLogsQueryFiltering = async (
  contract: any,
  filter: any,
  fromBlock: string | undefined = undefined,
  toBlock: string | undefined = undefined,
  currentBlockTTL: number = 60_000,
): Promise<any[]> => {
  const currentBlock = new Cache<string, bigint>()
  const fromBlockNumber = BigInt(fromBlock || '0')
  let finalToBlock: bigint

  // Fetch current block if not provided
  if (!toBlock) {
    const cached = currentBlock.get('mainnet')
    if (cached) {
      finalToBlock = cached
    } else {
      const rpcResponse = await fetch('/api/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          {
            id: 1,
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
          },
        ]),
      })

      const result = await rpcResponse.json()
      if (!Array.isArray(result) || !result[0]?.result) {
        throw new Error('Failed to fetch latest block number from /api/rpc')
      }

      finalToBlock = BigInt(result[0].result)
      currentBlock.put('mainnet', finalToBlock, currentBlockTTL)
    }
  } else {
    finalToBlock = BigInt(toBlock)
  }

  const logs: any[] = []
  const maxRange = BigInt(MAX_ETH_GET_LOGS_RANGE)
  let currentFrom = fromBlockNumber

  // Loop through full range in batches
  while (currentFrom <= finalToBlock) {
    const currentTo =
      currentFrom + maxRange - ONE_BIGINT > finalToBlock
        ? finalToBlock
        : currentFrom + maxRange - ONE_BIGINT

    const fromBlockArg = Number(currentFrom)
    const toBlockArg = Number(currentTo)

    const batchLogs = await contract.queryFilter(
      filter,
      fromBlockArg,
      toBlockArg,
    )
    logs.push(...batchLogs)

    currentFrom = currentTo + ONE_BIGINT
  }

  return logs
}
