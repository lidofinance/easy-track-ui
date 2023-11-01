import { CHAINS } from '@lido-sdk/constants'
import { utils } from 'ethers'
import {
  ContractAragonAcl,
  ContractSDVTRegistry,
} from 'modules/blockChain/contracts'

export async function checkIsAddressManagerOfNodeOperator(
  address: string,
  nodeOperatorId: string,
  chainId: CHAINS,
) {
  try {
    const sdvtRegistry = ContractSDVTRegistry.connectRpc({ chainId })
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
  chainId: CHAINS,
) => {
  const sdvtRegistry = ContractSDVTRegistry.connectRpc({ chainId })
  const contractAragonAcl = ContractAragonAcl.connectRpc({ chainId })
  const MANAGE_SIGNING_KEYS_ROLE = await sdvtRegistry.MANAGE_SIGNING_KEYS()
  const result = await contractAragonAcl.getPermissionParamsLength(
    utils.getAddress(address),
    sdvtRegistry.address,
    MANAGE_SIGNING_KEYS_ROLE,
  )
  return !result.isZero()
}
