import {
  ActivateNodeOperatorsAbi,
  ChangeNodeOperatorManagersAbi,
  DeactivateNodeOperatorsAbi,
} from 'generated'
import { MotionTypeForms } from '../types'
import { getMotionsCallData } from './getMotionsCallData'
import { CONCURRENT_IDS_ERROR } from './constants'
import { getConcurrentMotionsErrorText } from './getConcurrentMotionsErrorText'
import { MotionValidator } from './types'
import {
  validateConcurrentMotions,
  validateDuplicateMotionsByKeys,
} from './validateConcurrentMotions'

export const validateSDVTNodeOperatorManagerChange: MotionValidator = async ({
  activeMotionsMap,
  chainId,
  formData,
}) => {
  const activeMotions =
    activeMotionsMap[MotionTypeForms.SDVTNodeOperatorManagerChange] ?? []

  const motionsCallData =
    await getMotionsCallData<ChangeNodeOperatorManagersAbi>(
      activeMotions,
      chainId,
    )

  // Check MF0707: No managers duplicates in concurrent motions
  // MF0707 Check for ids
  const activeMotionsValidation = validateDuplicateMotionsByKeys({
    callData: motionsCallData,
    formData,
    callDataKey: 'nodeOperatorId',
    formDataKey: 'id',
  })
  if (!activeMotionsValidation) {
    return {
      message: CONCURRENT_IDS_ERROR,
      type: 'error',
    }
  }

  // MF0707 Check for addresses
  const activeMotionsAddressValidation = validateDuplicateMotionsByKeys({
    callData: motionsCallData,
    formData,
    callDataKey: 'newManagerAddress',
    formDataKey: 'newManagerAddress',
  })
  if (!activeMotionsAddressValidation) {
    return getConcurrentMotionsErrorText('manager address', 'error')
  }

  // Check MF0708: No concurrent deactivate node operator motions for old manager address
  const activeDeactivateMotionsValidation =
    await validateConcurrentMotions<DeactivateNodeOperatorsAbi>({
      motionType: MotionTypeForms.SDVTNodeOperatorsDeactivate,
      activeMotionsMap,
      chainId,
      formData,
      callDataKey: 'managerAddress',
      formDataKey: 'oldManagerAddress',
    })
  if (!activeDeactivateMotionsValidation) {
    return getConcurrentMotionsErrorText('manager address', 'error')
  }

  const activeAddNodeOperatosMotionsValidation =
    await validateConcurrentMotions({
      motionType: MotionTypeForms.SDVTNodeOperatorsAdd,
      activeMotionsMap,
      chainId,
      formData,
      callDataKey: 'managerAddress',
      formDataKey: 'newManagerAddress',
    })
  if (!activeAddNodeOperatosMotionsValidation) {
    return getConcurrentMotionsErrorText('manager address', 'error')
  }

  const activeActivateNodeOperatosMotionsValidation =
    await validateConcurrentMotions<ActivateNodeOperatorsAbi>({
      motionType: MotionTypeForms.SDVTNodeOperatorsActivate,
      activeMotionsMap,
      chainId,
      formData,
      callDataKey: 'managerAddress',
      formDataKey: 'newManagerAddress',
    })

  if (!activeActivateNodeOperatosMotionsValidation) {
    return getConcurrentMotionsErrorText('manager address', 'error')
  }

  return null
}
