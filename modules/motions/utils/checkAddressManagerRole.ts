import { utils } from 'ethers'
import { AragonACLAbi, NodeOperatorsRegistryAbi } from 'generated'
import { SIGNING_KEYS_ROLE } from '../constants'

export async function checkIsAddressManagerOfNodeOperator(
  address: string,
  nodeOperatorId: string,
  sdvtRegistry: NodeOperatorsRegistryAbi,
) {
  try {
    return sdvtRegistry.canPerform(
      utils.getAddress(address),
      SIGNING_KEYS_ROLE,
      [parseInt(nodeOperatorId)],
    )
  } catch (error) {
    return false
  }
}

export const checkAddressForManageSigningKeysRole = async (
  address: string,
  sdvtRegistry: NodeOperatorsRegistryAbi,
  aragonAcl: AragonACLAbi,
) => {
  const result = await aragonAcl.getPermissionParamsLength(
    utils.getAddress(address),
    sdvtRegistry.address,
    SIGNING_KEYS_ROLE,
  )
  return !result.isZero()
}
