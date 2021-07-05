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
  NodeOperator = 'NodeOperator',
  LEGO = 'LEGO',
}

export enum MotionStatus {
  Ongoing = 'Ongoing',
  Pending = 'Pending',
  Enacted = 'Enacted',
  Canceled = 'Canceled',
}
