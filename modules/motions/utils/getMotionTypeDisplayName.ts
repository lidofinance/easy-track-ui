import { EvmUnrecognized } from '../evmAddresses'
import { MotionType } from '../types'

export const MotionTypeDisplayNames: Record<
  MotionType | EvmUnrecognized,
  string
> = {
  [MotionType.NodeOperatorIncreaseLimit]:
    'Increase node operator staking limit',
  [MotionType.AllowedRecipientTopUpTrpLdo]: 'Top up LDO TRP',
  [MotionType.LegoLDOTopUp]: 'Top up LEGO LDO',
  [MotionType.RccStablesTopUp]: 'Top up RCC stablecoins',
  [MotionType.PmlStablesTopUp]: 'Top up PML stablecoins',
  [MotionType.AtcStablesTopUp]: 'Top up ATC stablecoins',
  [MotionType.StethRewardProgramAdd]: 'Add stETH reward program',
  [MotionType.StethRewardProgramRemove]: 'Remove stETH reward program',
  [MotionType.StethRewardProgramTopUp]: 'Top up stETH reward programs',
  [MotionType.StethGasSupplyAdd]: 'Add stETH Gas Supply recipient',
  [MotionType.StethGasSupplyRemove]: 'Remove stETH Gas Supply recipient',
  [MotionType.StethGasSupplyTopUp]: 'Top up stETH Gas Supply recipients',
  [MotionType.RewardsShareProgramAdd]: 'Add Rewards Share Program participant',
  [MotionType.RewardsShareProgramRemove]:
    'Remove Rewards Share Program participant',
  [MotionType.RewardsShareProgramTopUp]:
    'Top up Rewards Share Program participants',
  [MotionType.SDVTNodeOperatorsAdd]: 'Add node operators',
  [MotionType.SDVTNodeOperatorsActivate]: 'Activate node operators',
  [MotionType.SDVTNodeOperatorsDeactivate]: 'Deactivate node operators',
  [MotionType.SDVTVettedValidatorsLimitsSet]: 'Set vetted validators limits',
  [MotionType.SDVTTargetValidatorLimitsUpdateV2]:
    'Update target validator limits',
  [MotionType.SDVTNodeOperatorRewardAddressesSet]:
    'Set node operators reward addresses',
  [MotionType.SDVTNodeOperatorManagerChange]: 'Change node operators managers',
  [MotionType.SDVTNodeOperatorNamesSet]: 'Set node operators names',
  [MotionType.SDVTNodeOperatorManagerChange]: 'Change node operators managers',
  [MotionType.SandboxNodeOperatorIncreaseLimit]:
    '[NOR SandBox] Increase node operator staking limit',
  [MotionType.RccStethTopUp]: 'Top up RCC stETH',
  [MotionType.PmlStethTopUp]: 'Top up PML stETH',
  [MotionType.AtcStethTopUp]: 'Top up ATC stETH',
  [MotionType.LegoStablesTopUp]: 'Top up LEGO stablecoins',
  [MotionType.CSMSettleElStealingPenalty]:
    'Settle EL Rewards Stealing penalty for CSM operators',

  [EvmUnrecognized]: 'Unrecognized evm factory',

  // next motion types are retired
  // we are keeping them here to display history data
  [MotionType.LEGOTopUp]: 'Top up LEGO',
  [MotionType.GasFunderETHTopUp]: 'Top up Gas Funder ETH',
  [MotionType.RewardProgramAdd]: 'Add reward program',
  [MotionType.RewardProgramRemove]: 'Remove reward program',
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
  [MotionType.RccDAITopUp]: 'Top up RCC DAI',
  [MotionType.PmlDAITopUp]: 'Top up PML DAI',
  [MotionType.AtcDAITopUp]: 'Top up ATC DAI',
  [MotionType.SandboxStablesTopUp]: 'Top up sandbox stables',
  [MotionType.SandboxStablesAdd]: 'Add sandbox stables recipient',
  [MotionType.SandboxStablesRemove]: 'Remove sandbox stables recipient',
  [MotionType.LegoDAITopUp]: 'Top up LEGO DAI',
  [MotionType.StonksStablesTopUp]: 'Top up stonks stablecoins',
  [MotionType.StonksStethTopUp]: 'Top up stonks stETH',
  [MotionType.AllianceOpsStablesTopUp]: 'Top up Alliance Ops stablecoins',
} as const

export function getMotionTypeDisplayName(
  motionType: MotionType | EvmUnrecognized,
) {
  return MotionTypeDisplayNames[motionType]
}
