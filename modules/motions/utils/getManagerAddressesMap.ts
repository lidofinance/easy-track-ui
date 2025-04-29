import { CHAINS } from '@lido-sdk/constants'
import { BigNumber, utils } from 'ethers'
import { AragonACLAbi } from 'generated'
import { GET_LOG_BLOCK_LIMIT } from 'modules/blockChain/constants'

// Event ABI for ACL's SetPermissionParams event
const ACL_EVENT_ABI = [
  'event SetPermissionParams(address indexed entity, address indexed app, bytes32 indexed role, bytes32 paramsHash)',
]
const ACL_INTERFACE = new utils.Interface(ACL_EVENT_ABI)

const SIGNING_KEYS_ROLE =
  '0x75abc64490e17b40ea1e66691c3eb493647b24430b358bd87ec3e5127f1621ee' // keccak256("MANAGE_SIGNING_KEYS")

// Deploy block of Simple DVT registry per chain
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

/*
  This function is used to get the manager address for the Simple DVT node operator
  using ACL's SetPermissionParams event parsing.
*/
export const getSDVTOperatorManager = async ({
  registryAddress,
  chainId,
  currentBlock,
  aragonAcl,
  nodeOperatorId,
}: Args) => {
  const rawPermissionParam = BigNumber.from(1).shl(240).add(nodeOperatorId)
  const permissionParam = utils.solidityKeccak256(
    ['uint256'],
    [rawPermissionParam],
  )

  const eventFilter = aragonAcl.filters.SetPermissionParams(
    null,
    registryAddress,
    SIGNING_KEYS_ROLE,
  )
  let fromBlock =
    currentBlock - GET_LOG_BLOCK_LIMIT <= 0
      ? 0
      : currentBlock - GET_LOG_BLOCK_LIMIT
  let toBlock = currentBlock

  let managerAddress: string | undefined
  while (toBlock >= (FROM_BLOCK[chainId] ?? GET_LOG_BLOCK_LIMIT)) {
    const events = await aragonAcl.queryFilter(eventFilter, fromBlock, toBlock)

    for (const event of events) {
      const parsedEvent = ACL_INTERFACE.parseLog(event)

      if (parsedEvent.args.paramsHash === permissionParam) {
        managerAddress = parsedEvent.args.entity
      }
    }

    if (!!managerAddress) {
      break
    }

    fromBlock =
      fromBlock - GET_LOG_BLOCK_LIMIT <= 0 ? 0 : fromBlock - GET_LOG_BLOCK_LIMIT
    toBlock = toBlock - GET_LOG_BLOCK_LIMIT
  }

  if (!managerAddress) {
    throw new Error(
      `Manager address not found for node operator ${nodeOperatorId}`,
    )
  }

  return managerAddress
}
