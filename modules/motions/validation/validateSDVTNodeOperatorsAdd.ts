import { MotionTypeForms } from '../types'
import { MotionValidator } from './types'

export const validateSDVTNodeOperatorsAdd: MotionValidator = ({
  activeMotionsMap,
}) => {
  const activeMotions = activeMotionsMap[MotionTypeForms.SDVTNodeOperatorsAdd]
  if (!activeMotions?.length) {
    return null
  }

  return {
    message:
      'There is already an active motion to add node operators. Please wait for it to be processed.',
    type: 'error',
  }
}
