import { SetNodeOperatorRewardAddressesAbi } from 'generated'
import { MotionTypeForms } from '../types'
import { getConcurrentMotionsErrorText } from './getConcurrentMotionsErrorText'
import { MotionValidator } from './types'
import { validateConcurrentMotions } from './validateConcurrentMotions'

export const validateSDVTNodeOperatorRewardAddressesSet: MotionValidator =
  async args => {
    // Check MF0506: No same reward addresses assignment in concurrent motions
    const activeMotionsValidation =
      await validateConcurrentMotions<SetNodeOperatorRewardAddressesAbi>({
        motionType: MotionTypeForms.SDVTNodeOperatorRewardAddressesSet,
        callDataKey: 'rewardAddress',
        formDataKey: 'newRewardAddress',
        ...args,
      })

    if (!activeMotionsValidation) {
      return getConcurrentMotionsErrorText('reward address', 'error')
    }

    return null
  }
