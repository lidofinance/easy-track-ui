import { EvmUnrecognized } from '../evmAddresses'
import { MotionType } from '../types'

const MotionTypeDisplayNames: Record<MotionType | EvmUnrecognized, string> = {
  [MotionType.NodeOperatorIncreaseLimit]:
    'Increase node operator staking limit',
  [MotionType.LEGOTopUp]: 'Top up LEGO',
  [MotionType.RewardProgramAdd]: 'Add reward program',
  [MotionType.RewardProgramRemove]: 'Remove reward program',
  [MotionType.RewardProgramTopUp]: 'Top up reward program',
  [EvmUnrecognized]: 'Unrecognized evm factory',
} as const

export function getMotionTypeDisplayName(
  motionType: MotionType | EvmUnrecognized,
) {
  return MotionTypeDisplayNames[motionType]
}