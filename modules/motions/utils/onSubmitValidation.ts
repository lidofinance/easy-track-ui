import { CHAINS } from '@lido-sdk/constants'
import { LimitedJsonRpcBatchProvider } from 'modules/blockChain/utils/limitedJsonRpcBatchProvider'
import { MotionType, MotionTypeForms } from 'modules/motions/types'
import { getDefaultFormPartsData } from 'modules/motions/ui/MotionFormStartNew/Parts'
import { validateForceExits } from './validateForceExits'
import { validateGateTreeIpfs } from './validateGateTreeIpfs'

type MotionFormData<M extends MotionTypeForms> = ReturnType<
  typeof getDefaultFormPartsData
>[M]

type ChainData = {
  chainId: CHAINS
  provider: LimitedJsonRpcBatchProvider
}

type ValidateFn<M extends MotionTypeForms> = (
  formData: MotionFormData<M>,
  chainData: ChainData,
) => Promise<string | null> | string | null

const EXTRA_VALIDATION_MAP: {
  [K in MotionTypeForms]?: ValidateFn<K>
} = {
  [MotionType.CSMSetVettedGateTree]: validateGateTreeIpfs,
  [MotionType.ForceValidatorExitsInVaultHub]: validateForceExits,
}

export const validateMotionExtraData = <M extends MotionTypeForms>(
  motionType: M,
  formValues: MotionFormData<M>,
  chainData: ChainData,
) => {
  const validateFn = EXTRA_VALIDATION_MAP[motionType]

  if (!validateFn) {
    return null
  }

  return validateFn(formValues, chainData)
}
