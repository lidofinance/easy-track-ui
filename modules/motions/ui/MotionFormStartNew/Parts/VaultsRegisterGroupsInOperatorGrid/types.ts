export type TierParams = {
  shareLimit: string
  reserveRatioBP: string
  forcedRebalanceThresholdBP: string
  infraFeeBP: string
  liquidityFeeBP: string
  reservationFeeBP: string
}

export type GridGroup = {
  nodeOperator: string
  shareLimit: string
  tiers: TierParams[]
}
