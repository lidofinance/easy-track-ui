import {
  IncreaseLimitMotionType,
  INCREASE_LIMIT_MOTION_MAP,
} from '../constants'

export function getStakingModuleByMotionType(
  motionType: IncreaseLimitMotionType,
) {
  return INCREASE_LIMIT_MOTION_MAP[motionType].stakingModule
}
