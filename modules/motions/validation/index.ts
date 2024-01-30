import { MotionTypeForms } from '../types'
import { MotionValidator } from './types'
import { validateSDVTNodeOperatorManagerChange } from './validateSDVTNodeOperatorManagerChange'
import { validateSDVTNodeOperatorNamesSet } from './validateSDVTNodeOperatorNamesSet'
import { validateSDVTNodeOperatorRewardAddressesSet } from './validateSDVTNodeOperatorRewardAddressesSet'
import { validateSDVTNodeOperatorsActivate } from './validateSDVTNodeOperatorsActivate'
import { validateSDVTNodeOperatorsAdd } from './validateSDVTNodeOperatorsAdd'
import { validateSDVTNodeOperatorsDeactivate } from './validateSDVTNodeOperatorsDeactivate'
import { validateSDVTTargetValidatorLimitsUpdate } from './validateSDVTTargetValidatorLimitsUpdate'
import { validateSDVTVettedValidatorLimitsSet } from './validateSDVTVettedValidatorLimitsSet'

const ADDITIONAL_FACTORIES_VALIDATIONS: Partial<
  Record<MotionTypeForms, MotionValidator>
> = {
  [MotionTypeForms.SDVTNodeOperatorsAdd]: validateSDVTNodeOperatorsAdd,
  [MotionTypeForms.SDVTNodeOperatorsDeactivate]:
    validateSDVTNodeOperatorsDeactivate,
  [MotionTypeForms.SDVTNodeOperatorsActivate]:
    validateSDVTNodeOperatorsActivate,
  [MotionTypeForms.SDVTNodeOperatorNamesSet]: validateSDVTNodeOperatorNamesSet,
  [MotionTypeForms.SDVTNodeOperatorRewardAddressesSet]:
    validateSDVTNodeOperatorRewardAddressesSet,
  [MotionTypeForms.SDVTTargetValidatorLimitsUpdate]:
    validateSDVTTargetValidatorLimitsUpdate,
  [MotionTypeForms.SDVTNodeOperatorManagerChange]:
    validateSDVTNodeOperatorManagerChange,
  [MotionTypeForms.SDVTVettedValidatorsLimitsSet]:
    validateSDVTVettedValidatorLimitsSet,
}

export const getMotionValidator = (motionType: MotionTypeForms) =>
  ADDITIONAL_FACTORIES_VALIDATIONS[motionType] ?? null
