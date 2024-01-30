import { SetNodeOperatorNamesAbi } from 'generated'
import { MotionTypeForms } from '../types'
import { getConcurrentMotionsErrorText } from './getConcurrentMotionsErrorText'
import { MotionValidator } from './types'
import { validateConcurrentMotions } from './validateConcurrentMotions'

export const validateSDVTNodeOperatorNamesSet: MotionValidator = async args => {
  // Check MF0406: No same names assignment in concurrent motions
  const activeMotionsValidation =
    await validateConcurrentMotions<SetNodeOperatorNamesAbi>({
      motionType: MotionTypeForms.SDVTNodeOperatorNamesSet,
      callDataKey: 'name',
      formDataKey: 'name',
      ...args,
    })

  if (!activeMotionsValidation) {
    return getConcurrentMotionsErrorText('name', 'error')
  }

  return null
}
