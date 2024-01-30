import { CHAINS } from '@lido-sdk/constants'
import { ActiveMotionsMap } from '../types'

export type MotionFactoryDecodeAbi = {
  decodeEVMScriptCallData: (...args: any) => Promise<any>
}

export type MotionValidationError = {
  message: string
  type: 'error' | 'warning'
}

export type MotionValidator = (args: {
  evmScriptFactory: string
  activeMotionsMap: ActiveMotionsMap
  chainId: CHAINS
  formData: any
}) => MotionValidationError | null | Promise<MotionValidationError | null>
