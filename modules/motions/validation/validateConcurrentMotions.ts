import { CHAINS } from '@lido-sdk/constants'
import { MotionTypeForms, ActiveMotionsMap } from '../types'
import { MotionFactoryDecodeAbi } from './types'
import { getMotionsCallData } from './getMotionsCallData'

type ValidateByKeysArgs = {
  callData: any[]
  callDataKey: string
  formData: any[]
  formDataKey: string
}

export const validateDuplicateMotionsByKeys = ({
  callData,
  callDataKey,
  formData,
  formDataKey,
}: ValidateByKeysArgs) => {
  const callDataSet = new Set(
    callData.map(item => item[callDataKey].toString().toLowerCase()),
  )

  const hasIntersection = formData.some(input =>
    callDataSet.has(input[formDataKey].toString().toLowerCase()),
  )

  if (hasIntersection) {
    return false
  }

  return true
}

type CallDataKey<F extends MotionFactoryDecodeAbi> = Exclude<
  keyof Awaited<ReturnType<F['decodeEVMScriptCallData']>>[number],
  keyof unknown[] | '0' | '1' | symbol
>

type ValidateArgs<F extends MotionFactoryDecodeAbi> = {
  activeMotionsMap: ActiveMotionsMap
  motionType: MotionTypeForms
  formData: any[]
  chainId: CHAINS
  callDataKey: CallDataKey<F>
  formDataKey: string
}

export const validateConcurrentMotions = async <
  F extends MotionFactoryDecodeAbi = MotionFactoryDecodeAbi,
>({
  activeMotionsMap,
  motionType,
  chainId,
  callDataKey,
  formDataKey,
  formData,
}: ValidateArgs<F>) => {
  const activeMotions = activeMotionsMap[motionType]
  if (!activeMotions?.length) {
    return true
  }
  const callData = await getMotionsCallData<F>(activeMotions, chainId)

  return validateDuplicateMotionsByKeys({
    callData,
    callDataKey,
    formData,
    formDataKey,
  })
}
