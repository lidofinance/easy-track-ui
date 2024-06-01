import {
  ActivateNodeOperatorsAbi,
  ChangeNodeOperatorManagersAbi,
} from 'generated'
import { MotionTypeForms } from '../types'
import { CONCURRENT_IDS_ERROR } from './constants'
import { getConcurrentMotionsErrorText } from './getConcurrentMotionsErrorText'
import { MotionValidator } from './types'
import { validateConcurrentMotions } from './validateConcurrentMotions'

export const validateSDVTNodeOperatorsActivate: MotionValidator =
  async args => {
    // Check MF0305: No duplicates in concurrent motions
    const activeMotionsValidation =
      await validateConcurrentMotions<ActivateNodeOperatorsAbi>({
        motionType: MotionTypeForms.SDVTNodeOperatorsActivate,
        callDataKey: 'nodeOperatorId',
        formDataKey: 'id',
        ...args,
      })

    if (!activeMotionsValidation) {
      return { message: CONCURRENT_IDS_ERROR, type: 'error' }
    }

    // Check MF0306: Manager addresses is not used in the motions to add node operators, change node operator manager
    // Check MF0306 for AddNodeOperators
    const addNodeOperatorsMotionsValidation = await validateConcurrentMotions({
      motionType: MotionTypeForms.SDVTNodeOperatorsAdd,
      callDataKey: 'managerAddress',
      formDataKey: 'managerAddress',
      ...args,
    })
    if (!addNodeOperatorsMotionsValidation) {
      return getConcurrentMotionsErrorText('manager address', 'error')
    }

    // Check MF0306 for ChangeNodeOperatorManagers
    const changeNodeOperatorManagersMotionsValidation =
      await validateConcurrentMotions<ChangeNodeOperatorManagersAbi>({
        motionType: MotionTypeForms.SDVTNodeOperatorManagerChange,
        callDataKey: 'newManagerAddress',
        formDataKey: 'managerAddress',
        ...args,
      })
    if (!changeNodeOperatorManagersMotionsValidation) {
      return getConcurrentMotionsErrorText('manager address', 'error')
    }

    return null
  }
