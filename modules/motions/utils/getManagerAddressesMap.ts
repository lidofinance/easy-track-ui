import { CHAINS } from '@lido-sdk/constants'
import { utils } from 'ethers'
import { AragonACLAbi } from 'generated'
import { ContractSDVTRegistry } from 'modules/blockChain/contracts'

// Event ABI for ACL's SetPermissionParams event
const ACL_EVENT_ABI = [
  'event SetPermissionParams(address indexed entity, address indexed app, bytes32 indexed role, bytes32 paramsHash)',
]
const ACL_INTERFACE = new utils.Interface(ACL_EVENT_ABI)

const SIGNING_KEYS_ROLE =
  '0x75abc64490e17b40ea1e66691c3eb493647b24430b358bd87ec3e5127f1621ee' // keccak256("MANAGE_SIGNING_KEYS")

const FROM_BLOCK = {
  [CHAINS.Mainnet]: 18731922,
  [CHAINS.Holesky]: 0,
  [CHAINS.Hoodi]: 0,
}

/*
  This function is used to get the list of managers for the Simple DVT node operators
  using ACL's SetPermissionParams event parsing. To get a manager address
  for a given node operator id, we need to get the permission param for that node

*/
export const getSDVTManagersAddressesMap = async (
  aragonAcl: AragonACLAbi,
  chainId: CHAINS,
) => {
  const sdvtRegistryAddress = ContractSDVTRegistry.address[chainId]

  if (!sdvtRegistryAddress) {
    console.error(`SDVTRegistry address not found for chainId: ${chainId}`)
    return {}
  }

  const eventFilter = aragonAcl.filters.SetPermissionParams(
    null,
    sdvtRegistryAddress,
    SIGNING_KEYS_ROLE,
  )

  const rawEvents = await aragonAcl.queryFilter(
    eventFilter,
    FROM_BLOCK[CHAINS.Mainnet],
  )
  return rawEvents.reduce((result, event) => {
    const parsedEvent = ACL_INTERFACE.parseLog(event)

    result[parsedEvent.args.paramsHash] = parsedEvent.args.entity

    return result
  }, {} as Record<string, string | undefined>)
}
