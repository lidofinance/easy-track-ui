import { CHAINS } from '@lido-sdk/constants'
import { BigNumber, utils } from 'ethers'
import { AragonACLAbi } from 'generated'

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

  const fromBlock = FROM_BLOCK[chainId] ?? 0

  const eventFilter = aragonAcl.filters.SetPermissionParams(
    null,
    registryAddress,
    SIGNING_KEYS_ROLE,
  )

  const events = await aragonAcl.queryFilter(
    eventFilter,
    fromBlock,
    currentBlock,
  )

  for (const event of events) {
    const parsed = ACL_INTERFACE.parseLog(event)

    if (parsed.args.paramsHash === permissionParam) {
      return parsed.args.entity
    }
  }

  throw new Error(
    `Manager address not found for node operator ${nodeOperatorId}`,
  )
}
