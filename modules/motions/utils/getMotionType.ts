import { utils } from 'ethers'
import { CHAINS } from '@lido-sdk/constants'
import { MotionType } from '../types'
import {
  EvmAddressesByChain,
  EvmTypesByAddress,
  EvmUnrecognized,
  parseEvmSupportedChainId,
} from '../evmAddresses'

export const parseScriptFactory = (chainId: CHAINS, scriptFactory: string) => {
  const address = utils.getAddress(scriptFactory)
  if (
    !EvmTypesByAddress[parseEvmSupportedChainId(chainId)].hasOwnProperty(
      address,
    )
  ) {
    throw new Error(`Script factory ${address} not recognized`)
  }
  return address
}

export const getMotionTypeByScriptFactory = (
  chainId: CHAINS,
  scriptFactory: string,
): MotionType | EvmUnrecognized => {
  try {
    return (
      EvmTypesByAddress[parseEvmSupportedChainId(chainId)][
        parseScriptFactory(chainId, scriptFactory)
      ] ?? EvmUnrecognized
    )
  } catch {
    return EvmUnrecognized
  }
}

export const getScriptFactoryByMotionType = (
  chainId: CHAINS,
  motionType: MotionType,
) => {
  return EvmAddressesByChain[parseEvmSupportedChainId(chainId)][motionType]
}
