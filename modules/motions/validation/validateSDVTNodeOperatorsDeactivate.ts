import {
  ChangeNodeOperatorManagersAbi,
  DeactivateNodeOperatorsAbi,
} from 'generated'
import { MotionTypeForms } from '../types'
import { CONCURRENT_IDS_ERROR } from './constants'
import { getConcurrentMotionsErrorText } from './getConcurrentMotionsErrorText'
import { MotionValidator } from './types'
import { validateConcurrentMotions } from './validateConcurrentMotions'

export const validateSDVTNodeOperatorsDeactivate: MotionValidator =
  async args => {
    // Check MF0205: No duplicates in motions
    const activeMotionsValidation =
      await validateConcurrentMotions<DeactivateNodeOperatorsAbi>({
        motionType: MotionTypeForms.SDVTNodeOperatorsDeactivate,
        callDataKey: 'nodeOperatorId',
        formDataKey: 'id',
        ...args,
      })
    if (!activeMotionsValidation) {
      return { message: CONCURRENT_IDS_ERROR, type: 'error' }
    }

    // Check MF0206: Manager addresses is not used in change manager motions
    const changeManagersMotionsValidation =
      await validateConcurrentMotions<ChangeNodeOperatorManagersAbi>({
        motionType: MotionTypeForms.SDVTNodeOperatorManagerChange,
        callDataKey: 'oldManagerAddress',
        formDataKey: 'managerAddress',
        ...args,
      })
    if (!changeManagersMotionsValidation) {
      return getConcurrentMotionsErrorText('manager address', 'error')
    }

    return null
  }
