import { utils } from 'ethers'
import { CHAINS } from '@lido-sdk/constants'
import { ContractAragonAcl } from 'modules/blockChain/contracts'

// Event ABI for ACL's SetPermissionParams event
const ACL_EVENT_ABI = [
  'event SetPermissionParams(address indexed entity, address indexed app, bytes32 indexed role, bytes32 paramsHash)',
]
const ACL_INTERFACE = new utils.Interface(ACL_EVENT_ABI)

/*
  This function is used to get the list of managers for the Simple DVT node operators
  using ACL's SetPermissionParams event parsing. To get a manager address
  for a given node operator id, we need to get the permission param for that node

*/
export const getManagerAddressesMap = async (
  registryAddress: string,
  signingKeysRole: string,
  chainId: CHAINS,
) => {
  const aclContract = ContractAragonAcl.connectRpc({ chainId })

  const eventFilter = aclContract.filters.SetPermissionParams(
    null,
    registryAddress,
    signingKeysRole,
  )

  const rawEvents = await aclContract.queryFilter(eventFilter)
  return rawEvents.reduce((result, event) => {
    const parsedEvent = ACL_INTERFACE.parseLog(event)

    result[parsedEvent.args.paramsHash] = parsedEvent.args.entity

    return result
  }, {} as Record<string, string | undefined>)
}
