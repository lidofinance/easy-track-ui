import { EvmUnrecognized } from '../evmAddresses'
import { MotionType } from '../types'

const MotionTypeDisplayNames: Record<MotionType | EvmUnrecognized, string> = {
  [MotionType.NodeOperatorIncreaseLimit]:
    'Increase node operator staking limit',
  [MotionType.LEGOTopUp]: 'Top up LEGO',
  // @deprecated
  [MotionType.RewardProgramAdd]: 'Add reward program',
  // @deprecated
  [MotionType.RewardProgramRemove]: 'Remove reward program',
  // @deprecated
  [MotionType.RewardProgramTopUp]: 'Top up reward program',
  [MotionType.ReferralPartnerAdd]: 'Add referral partner',
  [MotionType.ReferralPartnerRemove]: 'Remove referral partner',
  [MotionType.ReferralPartnerTopUp]: 'Top up referral partner',
  [MotionType.AllowedRecipientAdd]: 'Add reward program',
  [MotionType.AllowedRecipientRemove]: 'Remove reward program',
  [MotionType.AllowedRecipientTopUp]: 'Top up reward program',
  [MotionType.LegoDAITopUp]: 'Top up LEGO DAI recipient',
  [EvmUnrecognized]: 'Unrecognized evm factory',
} as const

export function getMotionTypeDisplayName(
  motionType: MotionType | EvmUnrecognized,
) {
  return MotionTypeDisplayNames[motionType]
}
