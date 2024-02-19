import { UpdateTargetValidatorLimitsAbi } from 'generated'
import { MotionTypeForms } from '../types'
import { CONCURRENT_IDS_ERROR } from './constants'
import { MotionValidator } from './types'
import { validateConcurrentMotions } from './validateConcurrentMotions'

export const validateSDVTTargetValidatorLimitsUpdate: MotionValidator =
  async args => {
    // Check MF0604: Same node operator in concurrent motions
    const activeMotionsValidation =
      await validateConcurrentMotions<UpdateTargetValidatorLimitsAbi>({
        motionType: MotionTypeForms.SDVTTargetValidatorLimitsUpdate,
        callDataKey: 'nodeOperatorId',
        formDataKey: 'id',
        ...args,
      })

    if (!activeMotionsValidation) {
      return {
        message: CONCURRENT_IDS_ERROR,
        type: 'warning',
      }
    }

    return null
  }
