import type { BigNumber } from 'ethers'
import type { EasyTrackAbi } from 'generated'

export const MotionType = {
  NodeOperatorIncreaseLimit: 'NodeOperatorIncreaseLimit',
  LEGOTopUp: 'LEGOTopUp',
  // @deprecated
  RewardProgramAdd: 'RewardProgramAdd',
  // @deprecated
  RewardProgramRemove: 'RewardProgramRemove',
  // @deprecated
  RewardProgramTopUp: 'RewardProgramTopUp',
  ReferralPartnerAdd: 'ReferralPartnerAdd',
  ReferralPartnerRemove: 'ReferralPartnerRemove',
  ReferralPartnerTopUp: 'ReferralPartnerTopUp',
  AllowedRecipientAdd: 'AllowedRecipientAdd',
  AllowedRecipientRemove: 'AllowedRecipientRemove',
  AllowedRecipientTopUp: 'AllowedRecipientTopUp',
  SingleAllowedRecipientTopUp: 'SingleAllowedRecipientTopUp',
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
}

export type RawMotionOnchain = Awaited<
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
