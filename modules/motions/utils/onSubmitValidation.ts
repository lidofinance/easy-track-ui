import { MotionType, MotionTypeForms } from 'modules/motions/types'
import { getDefaultFormPartsData } from 'modules/motions/ui/MotionFormStartNew/Parts'
import { validateGateTreeIpfs } from './validateGateTreeIpfs'

type MotionFormData<M extends MotionTypeForms> = ReturnType<
  typeof getDefaultFormPartsData
>[M]

type ValidateFn<M extends MotionTypeForms> = (
  formData: MotionFormData<M>,
) => Promise<string | null> | string | null

const EXTRA_VALIDATION_MAP: {
  [K in MotionTypeForms]?: ValidateFn<K>
} = {
  [MotionType.CSMSetVettedGateTree]: validateGateTreeIpfs,
}

export const validateMotionExtraData = <M extends MotionTypeForms>(
  motionType: M,
  formValues: MotionFormData<M>,
) => {
  const validateFn = EXTRA_VALIDATION_MAP[motionType]

  if (!validateFn) {
    return null
  }

  return validateFn(formValues)
}
