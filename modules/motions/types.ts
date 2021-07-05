import type { BigNumber } from 'ethers'

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
}

export enum MotionType {
  NodeOperatorLimit = 'NodeOperatorLimit',
  LEGOTopUp = 'LEGOTopUp',
  RewardProgramAdd = 'RewardProgramAdd',
  RewardProgramRemove = 'RewardProgramRemove',
  RewardProgramTopUp = 'RewardProgramTopUp',
}

export enum MotionStatus {
  Ongoing = 'Ongoing',
  Pending = 'Pending',
  Enacted = 'Enacted',
  Canceled = 'Canceled',
}
