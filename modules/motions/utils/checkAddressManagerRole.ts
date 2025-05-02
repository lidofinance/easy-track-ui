import { utils } from 'ethers'
import { AragonACLAbi, NodeOperatorsRegistryAbi } from 'generated'

export async function checkIsAddressManagerOfNodeOperator(
  address: string,
  nodeOperatorId: string,
  sdvtRegistry: NodeOperatorsRegistryAbi,
) {
  try {
    const role = await sdvtRegistry.MANAGE_SIGNING_KEYS()
    return sdvtRegistry.canPerform(utils.getAddress(address), role, [
      parseInt(nodeOperatorId),
    ])
  } catch (error) {
    return false
  }
}

export const checkAddressForManageSigningKeysRole = async (
  address: string,
  sdvtRegistry: NodeOperatorsRegistryAbi,
  aragonAcl: AragonACLAbi,
) => {
  const MANAGE_SIGNING_KEYS_ROLE = await sdvtRegistry.MANAGE_SIGNING_KEYS()
  const result = await aragonAcl.getPermissionParamsLength(
    utils.getAddress(address),
    sdvtRegistry.address,
    MANAGE_SIGNING_KEYS_ROLE,
  )
  return !result.isZero()
}
