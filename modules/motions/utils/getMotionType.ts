import { Chains, parseChainId } from 'modules/blockChain/chains'
import { MotionType } from '../types'
import {
  EvmAddressesByChain,
  EvmTypesByAdress,
  EvmUnrecognized,
} from '../evmAddresses'

export const parseScriptFactory = (chainId: Chains, scriptFactory: string) => {
  const address = scriptFactory.toLowerCase()
  if (!EvmTypesByAdress[parseChainId(chainId)].hasOwnProperty(address)) {
    throw new Error(`Script factory ${address} not recognized`)
  }
  return address
}

export const getMotionTypeByScriptFactory = (
  chainId: Chains,
  scriptFactory: string,
): MotionType | EvmUnrecognized => {
  try {
    return EvmTypesByAdress[parseChainId(chainId)][
      parseScriptFactory(chainId, scriptFactory)
    ]
  } catch {
    return EvmUnrecognized
  }
}

export const getScriptFactoryByMotionType = (
  chainId: Chains,
  motionType: MotionType,
) => {
  return EvmAddressesByChain[parseChainId(chainId)][motionType]
}
