export type Motion = {
  id: number
  evmScriptFactory: string
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
