import { BigNumber } from 'ethers'
import { OperatorGridAbi } from 'generated'

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

export type VaultData = {
  nodeOperator: string
  isVaultConnected: boolean
  isPendingDisconnect: boolean
  infraFeeBP: number
  liquidityFeeBP: number
  reservationFeeBP: number
  badDebtEth: BigNumber
  jailStatus: boolean
}

export type Group = Awaited<ReturnType<OperatorGridAbi['group']>>
