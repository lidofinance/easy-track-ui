import { formatEther } from '@ethersproject/units'
import type { BigNumber } from 'ethers'
import type { Motion } from '../types'

export function getMotionProgress(motion: Motion, totalSupply: BigNumber) {
  const thresholdPct = motion.objectionsThreshold / 100
  const totalSupplyNumber = Number(formatEther(totalSupply))
  const objectionsAmount = Number(formatEther(motion.objectionsAmount))
  const thresholdAmount = (totalSupplyNumber * thresholdPct) / 100
  const objectionsPct = (objectionsAmount / thresholdAmount) * 100
  return {
    thresholdPct,
    thresholdAmount,
    objectionsPct,
    objectionsAmount,
  }
}

export type MotionProgress = ReturnType<typeof getMotionProgress>
