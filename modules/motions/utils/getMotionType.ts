import { utils } from 'ethers'
import { CHAINS } from '@lido-sdk/constants'
import { parseChainId } from 'modules/blockChain/chains'
import { MotionType } from '../types'
import {
  EvmAddressesByChain,
  EvmTypesByAdress,
  EvmUnrecognized,
} from '../evmAddresses'

export const parseScriptFactory = (chainId: CHAINS, scriptFactory: string) => {
  const address = utils.getAddress(scriptFactory)
  if (!EvmTypesByAdress[parseChainId(chainId)].hasOwnProperty(address)) {
    throw new Error(`Script factory ${address} not recognized`)
  }
  return address
}

export const getMotionTypeByScriptFactory = (
  chainId: CHAINS,
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
  chainId: CHAINS,
  motionType: MotionType,
) => {
  return EvmAddressesByChain[parseChainId(chainId)][motionType]
}
