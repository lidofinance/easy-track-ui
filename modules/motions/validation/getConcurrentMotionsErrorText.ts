import { MotionValidationError } from './types'

export const getConcurrentMotionsErrorText = (
  entity: string,
  type: MotionValidationError['type'],
) => {
  return {
    message: `The ${entity} of one of the node operators is already used in concurrent motion.`,
    type,
  }
}
