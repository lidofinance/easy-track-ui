import { CHAINS } from '@lido-sdk/constants'
import { BigNumber, utils } from 'ethers'
import { AragonACLAbi } from 'generated'
import {
  GET_LOG_BLOCK_LIMIT,
  MAX_PROVIDER_BATCH,
} from 'modules/blockChain/constants'
import { processInBatches } from 'modules/blockChain/utils/processInBatches'

const ACL_EVENT_ABI = [
  'event SetPermissionParams(address indexed entity, address indexed app, bytes32 indexed role, bytes32 paramsHash)',
]
const ACL_INTERFACE = new utils.Interface(ACL_EVENT_ABI)

const SIGNING_KEYS_ROLE =
  '0x75abc64490e17b40ea1e66691c3eb493647b24430b358bd87ec3e5127f1621ee' // keccak256("MANAGE_SIGNING_KEYS")

const FROM_BLOCK: Partial<Record<CHAINS, number>> = {
  [CHAINS.Mainnet]: 18731922,
  [CHAINS.Holesky]: 31999,
  [CHAINS.Hoodi]: 727,
}

type Args = {
  registryAddress: string
  currentBlock: number
  chainId: CHAINS
  aragonAcl: AragonACLAbi
  nodeOperatorId: number
}

export const getSDVTOperatorManager = async ({
  registryAddress,
  chainId,
  currentBlock,
  aragonAcl,
  nodeOperatorId,
}: Args): Promise<string> => {
  const rawPermissionParam = BigNumber.from(1).shl(240).add(nodeOperatorId)
  const permissionParam = utils.solidityKeccak256(
    ['uint256'],
    [rawPermissionParam],
  )

  const fromBlockBase = FROM_BLOCK[chainId] ?? 0

  const eventFilter = aragonAcl.filters.SetPermissionParams(
    null,
    registryAddress,
    SIGNING_KEYS_ROLE,
  )

  const blockRanges: { from: number; to: number }[] = []

  for (let to = currentBlock; to >= fromBlockBase; to -= GET_LOG_BLOCK_LIMIT) {
    const from = Math.max(fromBlockBase, to - GET_LOG_BLOCK_LIMIT + 1)
    blockRanges.push({ from, to })
  }

  const results = await processInBatches(
    blockRanges,
    MAX_PROVIDER_BATCH,
    async ({ from, to }): Promise<string | null> => {
      const events = await aragonAcl.queryFilter(eventFilter, from, to)

      for (const event of events) {
        const parsed = ACL_INTERFACE.parseLog(event)

        if (parsed.args.paramsHash === permissionParam) {
          return parsed.args.entity
        }
      }

      return null
    },
  )

  const found = results.find(
    (res): res is PromiseFulfilledResult<string> =>
      res.status === 'fulfilled' && res.value !== null,
  )

  if (!found) {
    throw new Error(
      `Manager address not found for node operator ${nodeOperatorId}`,
    )
  }

  return found.value
}
