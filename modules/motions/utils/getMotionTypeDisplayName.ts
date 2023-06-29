import { EvmUnrecognized } from '../evmAddresses'
import { MotionType } from '../types'

export const MotionTypeDisplayNames: Record<
  MotionType | EvmUnrecognized,
  string
> = {
  [MotionType.NodeOperatorIncreaseLimit]:
    'Increase node operator staking limit',
  [MotionType.LEGOTopUp]: 'Top up LEGO',
  // @deprecated
  [MotionType.RewardProgramAdd]: 'Add reward program',
  // @deprecated
  [MotionType.RewardProgramRemove]: 'Remove reward program',
  // @deprecated
  [MotionType.RewardProgramTopUp]: 'Top up reward program',
  [MotionType.ReferralPartnerAdd]: 'Add LDO referral partner',
  [MotionType.ReferralPartnerRemove]: 'Remove LDO referral partner',
  [MotionType.ReferralPartnerTopUp]: 'Top up LDO referral partner',
  [MotionType.AllowedRecipientAdd]: 'Add reward program',
  [MotionType.AllowedRecipientRemove]: 'Remove reward program',
  [MotionType.AllowedRecipientTopUp]: 'Top up reward program',
  [MotionType.AllowedRecipientAddReferralDai]: 'Add DAI referral partner',
  [MotionType.AllowedRecipientRemoveReferralDai]: 'Remove DAI referral partner',
  [MotionType.AllowedRecipientTopUpReferralDai]: 'Top up DAI referral partner',
  [MotionType.AllowedRecipientTopUpTrpLdo]: 'Top up LDO TRP',
  [MotionType.LegoLDOTopUp]: 'Top up LEGO LDO',
  [MotionType.LegoDAITopUp]: 'Top up LEGO DAI',
  [MotionType.RccDAITopUp]: 'Top up RCC DAI',
  [MotionType.PmlDAITopUp]: 'Top up PML DAI',
  [MotionType.AtcDAITopUp]: 'Top up ATC DAI',
  [MotionType.GasFunderETHTopUp]: 'Top up Gas Funder ETH',
  [MotionType.StethRewardProgramAdd]: 'Add stETH reward program',
  [MotionType.StethRewardProgramRemove]: 'Remove stETH reward program',
  [MotionType.StethRewardProgramTopUp]: 'Top up stETH reward program',
  [EvmUnrecognized]: 'Unrecognized evm factory',
} as const

export function getMotionTypeDisplayName(
  motionType: MotionType | EvmUnrecognized,
) {
  return MotionTypeDisplayNames[motionType]
}
