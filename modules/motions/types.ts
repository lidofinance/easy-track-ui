import type { BigNumber } from 'ethers'
import type { PromiseValue } from 'type-fest'
import type { EasyTrackAbi } from 'generated'

export const MotionType = {
  NodeOperatorIncreaseLimit: 'NodeOperatorIncreaseLimit',
  LEGOTopUp: 'LEGOTopUp',
  AllowedRecipientTopUpTrpLdo: 'AllowedRecipientTopUpTrpLdo',
  LegoLDOTopUp: 'LegoLDOTopUp',
  LegoDAITopUp: 'LegoDAITopUp',
  RccDAITopUp: 'RccDAITopUp',
  PmlDAITopUp: 'PmlDAITopUp',
  AtcDAITopUp: 'AtcDAITopUp',
  GasFunderETHTopUp: 'GasFunderETHTopUp',
  StethRewardProgramAdd: 'StethRewardProgramAdd',
  StethRewardProgramRemove: 'StethRewardProgramRemove',
  StethRewardProgramTopUp: 'StethRewardProgramTopUp',
  StethGasSupplyAdd: 'StethGasSupplyAdd',
  StethGasSupplyRemove: 'StethGasSupplyRemove',
  StethGasSupplyTopUp: 'StethGasSupplyTopUp',

  // next motion types are retired
  // we are keeping them here to display history data
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
} as const
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionType = typeof MotionType[keyof typeof MotionType]

// Only motions currently supported to start
export const MotionTypeForms = {
  NodeOperatorIncreaseLimit: MotionType.NodeOperatorIncreaseLimit,
  LEGOTopUp: MotionType.LEGOTopUp,
  AllowedRecipientTopUpTrpLdo: MotionType.AllowedRecipientTopUpTrpLdo,
  LegoLDOTopUp: MotionType.LegoLDOTopUp,
  LegoDAITopUp: MotionType.LegoDAITopUp,
  RccDAITopUp: MotionType.RccDAITopUp,
  PmlDAITopUp: MotionType.PmlDAITopUp,
  AtcDAITopUp: MotionType.AtcDAITopUp,
  GasFunderETHTopUp: MotionType.GasFunderETHTopUp,
  StethRewardProgramAdd: MotionType.StethRewardProgramAdd,
  StethRewardProgramRemove: MotionType.StethRewardProgramRemove,
  StethRewardProgramTopUp: MotionType.StethRewardProgramTopUp,
  StethGasSupplyAdd: MotionType.StethGasSupplyAdd,
  StethGasSupplyRemove: MotionType.StethGasSupplyRemove,
  StethGasSupplyTopUp: MotionType.StethGasSupplyTopUp,
} as const
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionTypeForms =
  typeof MotionTypeForms[keyof typeof MotionTypeForms]

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
  operators: undefined | KeysInfoOperator[]
  keys: {
    signatureVerified: number
    duplicatesVerified: number
    total: number
    unusedButNotNew: number
    unused: number
    used: number
    unconfirmed: number
  }
  health: {
    nextUpdateTime: number
    lastUpdateTime: number
    serverTime: number
    status: string
  }
}
