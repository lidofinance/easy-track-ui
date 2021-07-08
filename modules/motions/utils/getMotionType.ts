import { Chains, parseChainId } from 'modules/blockChain/chains'
import { MotionType } from '../types'
import {
  EvmAddressesByChain,
  EvmTypesByAdress,
  EvmUnrecognized,
} from '../evmAddresses'

export const parseScriptFactory = (chainId: Chains, scriptFactory: string) => {
  if (!EvmTypesByAdress[parseChainId(chainId)].hasOwnProperty(scriptFactory)) {
    throw new Error(`Script factory ${scriptFactory} not recognized`)
  }
  return scriptFactory
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
