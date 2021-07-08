import { MotionType } from '../types'

const MotionTypeDisplayNames: Record<MotionType, string> = {
  [MotionType.NodeOperatorIncreaseLimit]:
    'Increase node operator staking limit',
  [MotionType.LEGOTopUp]: 'Top up LEGO',
  [MotionType.RewardProgramAdd]: 'Add reward program',
  [MotionType.RewardProgramRemove]: 'Remove reward program',
  [MotionType.RewardProgramTopUp]: 'Top up reward program',
} as const

export function getMotionTypeDisplayName(motionType: MotionType) {
  return MotionTypeDisplayNames[motionType]
}
