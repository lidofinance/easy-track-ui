import type { BigNumber } from 'ethers'
import type { PromiseValue } from 'type-fest'
import type { EasyTrackAbi } from 'generated'

export enum MotionType {
  NodeOperatorLimit = 'NodeOperatorLimit',
  LEGOTopUp = 'LEGOTopUp',
  RewardProgramAdd = 'RewardProgramAdd',
  RewardProgramRemove = 'RewardProgramRemove',
  RewardProgramTopUp = 'RewardProgramTopUp',
}

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

export type Motion = {
  id: number
  evmScriptFactory: string
  creator: string
  duration: number
  startDate: number
  snapshotBlock: number
  objectionsThreshold: number
  objectionsAmount: BigNumber
  objectionsAmountPct: number
  evmScriptHash: string
  status: MotionStatus
}

export type RawMotionOnchain = PromiseValue<
  ReturnType<InstanceType<typeof EasyTrackAbi>['getMotions']>
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
  objectionsAmountPct: string
  evmScriptHash: string
  status: MotionStatus
}
