import { EvmUnrecognized } from '../evmAddresses'
import { MotionType } from '../types'

const MotionTypeDisplayNames: Record<MotionType | EvmUnrecognized, string> = {
  [MotionType.NodeOperatorIncreaseLimit]:
    'Increase node operator staking limit',
  [MotionType.LEGOTopUp]: 'Top up LEGO',
  [MotionType.RewardProgramAdd]: 'Add reward program',
  [MotionType.RewardProgramRemove]: 'Remove reward program',
  [MotionType.RewardProgramTopUp]: 'Top up reward program',
  [MotionType.ReferralPartnerAdd]: 'Add referral partner',
  [MotionType.ReferralPartnerRemove]: 'Remove referral partner',
  [MotionType.ReferralPartnerTopUp]: 'Top up referral partner',
  [EvmUnrecognized]: 'Unrecognized evm factory',
} as const

export function getMotionTypeDisplayName(
  motionType: MotionType | EvmUnrecognized,
) {
  return MotionTypeDisplayNames[motionType]
}
