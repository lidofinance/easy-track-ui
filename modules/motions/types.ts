import type { ScriptFactory } from './utils/getMotionType'

export type Motion = {
  id: number
  evmScriptFactory: ScriptFactory
  creator: string
  duration: number
  startDate: number
  snapshotBlock: number
  objectionsThreshold: number
  objectionsAmount: number
  objectionsAmountPct: number
  evmScriptHash: string
  evmScriptCallData: string
}
