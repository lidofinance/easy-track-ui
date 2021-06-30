import { MotionType } from '../types'
import type { Invert } from 'modules/shared/utils/utilTypes'

export const MotionAddressesByType: Record<MotionType, string> = {
  [MotionType.LEGO]: '0x000',
  [MotionType.NodeOperator]: '0x81C2F1f181496089c4b93a378fe68614F609EB05',
} as const

export const MotionTypesByAddress = Object.fromEntries(
  Object.entries(MotionAddressesByType).map(([type, address]) => [
    address,
    type,
  ]),
) as Invert<typeof MotionAddressesByType>

export const parseScriptFactory = (scriptFactory: string) => {
  if (!MotionTypesByAddress.hasOwnProperty(scriptFactory)) {
    throw new Error(`Script factory ${scriptFactory} not recognized`)
  }
  return scriptFactory
}

export const getMotionTypeByScriptFactory = (scriptFactory: string) => {
  try {
    return MotionTypesByAddress[parseScriptFactory(scriptFactory)]
  } catch {
    return 'unrecognized type'
  }
}

export const getScriptFactoryByMotionType = (motionType: MotionType) => {
  return MotionAddressesByType[motionType]
}
