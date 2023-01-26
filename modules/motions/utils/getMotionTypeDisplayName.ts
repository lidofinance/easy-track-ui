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
  [MotionType.AllowedRecipientAddDai]: 'Add reward program DAI',
  [MotionType.AllowedRecipientRemoveDai]: 'Remove reward program DAI',
  [MotionType.AllowedRecipientTopUpDai]: 'Top up reward program DAI',
  [MotionType.LegoLDOTopUp]: 'Top up LEGO LDO',
  [MotionType.LegoDAITopUp]: 'Top up LEGO DAI',
  [MotionType.RccDAITopUp]: 'Top up RCC DAI',
  [MotionType.PmlDAITopUp]: 'Top up PML DAI',
  [MotionType.AtcDAITopUp]: 'Top up ATC DAI',
  [MotionType.GasFunderETHTopUp]: 'Top up Gas Funder ETH',
  [EvmUnrecognized]: 'Unrecognized evm factory',
} as const

export function getMotionTypeDisplayName(
  motionType: MotionType | EvmUnrecognized,
) {
  return MotionTypeDisplayNames[motionType]
}
