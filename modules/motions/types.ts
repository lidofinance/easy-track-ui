import type { BigNumber } from 'ethers'
import type { PromiseValue } from 'type-fest'
import type { EasyTrackAbi } from 'generated'

// Only motions currently supported to start
export const MotionTypeForms = {
  // old node operator
  NodeOperatorIncreaseLimit: 'NodeOperatorIncreaseLimit',
  // ET
  AllowedRecipientTopUpTrpLdo: 'AllowedRecipientTopUpTrpLdo',
  LegoLDOTopUp: 'LegoLDOTopUp',
  RccStablesTopUp: 'RccStablesTopUp',
  PmlStablesTopUp: 'PmlStablesTopUp',
  AtcStablesTopUp: 'AtcStablesTopUp',
  StethRewardProgramAdd: 'StethRewardProgramAdd',
  StethRewardProgramRemove: 'StethRewardProgramRemove',
  StethRewardProgramTopUp: 'StethRewardProgramTopUp',
  StethGasSupplyAdd: 'StethGasSupplyAdd',
  StethGasSupplyRemove: 'StethGasSupplyRemove',
  StethGasSupplyTopUp: 'StethGasSupplyTopUp',
  RewardsShareProgramAdd: 'RewardsShareProgramAdd',
  RewardsShareProgramRemove: 'RewardsShareProgramRemove',
  RewardsShareProgramTopUp: 'RewardsShareProgramTopUp',
  // ET DVT
  SDVTNodeOperatorsAdd: 'SDVTNodeOperatorsAdd',
  SDVTNodeOperatorsActivate: 'SDVTNodeOperatorsActivate',
  SDVTNodeOperatorsDeactivate: 'SDVTNodeOperatorsDeactivate',
  SDVTVettedValidatorsLimitsSet: 'SDVTVettedValidatorsLimitsSet',
  SDVTTargetValidatorLimitsUpdate: 'SDVTTargetValidatorLimitsUpdate',
  SDVTTargetValidatorLimitsUpdateV2: 'SDVTTargetValidatorLimitsUpdateV2',
  SDVTNodeOperatorRewardAddressesSet: 'SDVTNodeOperatorRewardAddressesSet',
  SDVTNodeOperatorNamesSet: 'SDVTNodeOperatorNamesSet',
  SDVTNodeOperatorManagerChange: 'SDVTNodeOperatorManagerChange',

  SandboxNodeOperatorIncreaseLimit: 'SandboxNodeOperatorIncreaseLimit',

  SandboxStablesTopUp: 'SandboxStablesTopUp',
  SandboxStablesAdd: 'SandboxStablesAdd',
  SandboxStablesRemove: 'SandboxStablesRemove',
  RccStethTopUp: 'RccStethTopUp',
  PmlStethTopUp: 'PmlStethTopUp',
  AtcStethTopUp: 'AtcStethTopUp',
  LegoStablesTopUp: 'LegoStablesTopUp',
  StonksStethTopUp: 'StonksStethTopUp',
  StonksStablesTopUp: 'StonksStablesTopUp',
  AllianceOpsStablesTopUp: 'AllianceOpsStablesTopUp',

  CSMSettleElStealingPenalty: 'CSMSettleElStealingPenalty',
} as const
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionTypeForms =
  typeof MotionTypeForms[keyof typeof MotionTypeForms]

// next motion types are retired
// we are keeping them here to display history data
export const MotionTypeDisplayOnly = {
  LEGOTopUp: 'LEGOTopUp',
  GasFunderETHTopUp: 'GasFunderETHTopUp',
  RewardProgramAdd: 'RewardProgramAdd',
  RewardProgramRemove: 'RewardProgramRemove',
  RewardProgramTopUp: 'RewardProgramTopUp',
  ReferralPartnerAdd: 'ReferralPartnerAdd',
  ReferralPartnerRemove: 'ReferralPartnerRemove',
  ReferralPartnerTopUp: 'ReferralPartnerTopUp',
  AllowedRecipientAdd: 'AllowedRecipientAdd',
  AllowedRecipientRemove: 'AllowedRecipientRemove',
  AllowedRecipientTopUp: 'AllowedRecipientTopUp',
  AllowedRecipientAddReferralDai: 'AllowedRecipientAddReferralDai',
  AllowedRecipientRemoveReferralDai: 'AllowedRecipientRemoveReferralDai',
  AllowedRecipientTopUpReferralDai: 'AllowedRecipientTopUpReferralDai',
  RccDAITopUp: 'RccDAITopUp',
  PmlDAITopUp: 'PmlDAITopUp',
  AtcDAITopUp: 'AtcDAITopUp',
  LegoDAITopUp: 'LegoDAITopUp',
} as const
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionTypeDisplayOnly =
  typeof MotionTypeDisplayOnly[keyof typeof MotionTypeDisplayOnly]

export const MotionType = {
  ...MotionTypeForms,
  ...MotionTypeDisplayOnly,
} as const
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionType = typeof MotionType[keyof typeof MotionType]

export const MotionStatus = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  CANCELED: 'CANCELED',
  REJECTED: 'REJECTED',
  ENACTED: 'ENACTED',
} as const
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionStatus = typeof MotionStatus[keyof typeof MotionStatus]

export const MotionDisplayStatus = {
  DEFAULT: 'DEFAULT',
  DANGER: 'DANGER',
  ATTENDED: 'ATTENDED',
  ATTENDED_DANGER: 'ATTENDED_DANGER',
  ACTIVE: 'ACTIVE',
  ENACTED: 'ENACTED',
} as const
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionDisplayStatus =
  typeof MotionDisplayStatus[keyof typeof MotionDisplayStatus]

export type Motion = {
  id: number
  evmScriptFactory: string
  creator: string
  duration: number
  startDate: number
  snapshotBlock: number
  objectionsThreshold: number
  objectionsAmount: BigNumber
  evmScriptHash: string
  evmScriptCalldata?: string
  status: MotionStatus
  enacted_at?: number
  canceled_at?: number
  rejected_at?: number
  isOnChain: boolean
}

export type RawMotionOnchain = PromiseValue<
  ReturnType<EasyTrackAbi['getMotions']>
>[0]

export type RawMotionSubgraph = {
  id: string
  evmScriptFactory: string
  creator: string
  duration: string
  startDate: string
  snapshotBlock: string
  objectionsThreshold: string
  objectionsAmount: string
  evmScriptHash: string
  evmScriptCalldata?: string
  status: MotionStatus
  enacted_at?: string
  canceled_at?: string
  rejected_at?: string
}

export type KeysInfoOperator = {
  invalid: string[]
  duplicates: string[]
  info: {
    index: number
    active: boolean
    name: string
    rewardAddress: string
    stakingLimit: number
    stoppedValidators: number
    totalSigningKeys: number
    usedSigningKeys: number
  }
}

export type KeysInfo = {
  operators?: KeysInfoOperator[]
}
