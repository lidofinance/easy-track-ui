import { CHAINS } from '@lido-sdk/constants'
import { ContractSDVTRegistry } from 'modules/blockChain/contracts'

export async function checkAddressForManageSigningKeysRole(
  address: string,
  nodeOperatorId: string,
  chainId: CHAINS,
) {
  try {
    const sdvtRegistry = ContractSDVTRegistry.connectRpc({ chainId })
    const role = await sdvtRegistry.MANAGE_SIGNING_KEYS()
    return sdvtRegistry.canPerform(address, role, [parseInt(nodeOperatorId)])
  } catch (error) {
    return false
  }
}
