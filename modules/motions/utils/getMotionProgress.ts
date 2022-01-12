import { formatEther } from '@ethersproject/units'
import type { BigNumber } from 'ethers'
import type { Motion } from '../types'

export function getMotionProgress(motion: Motion, totalSupply: BigNumber) {
  const thresholdPct = motion.objectionsThreshold / 100
  const totalSupplyNumber = Number(formatEther(totalSupply))
  const objectionsAmount = Number(formatEther(motion.objectionsAmount))
  const thresholdAmount = (totalSupplyNumber * thresholdPct) / 100
  const objectionsPct = (objectionsAmount / thresholdAmount) * 100

  const onlyZeros = Math.round(1 - Math.log10(objectionsPct))
  const objectionsPctFormatted =
    onlyZeros > 1 && onlyZeros < Infinity
      ? objectionsPct.toFixed(onlyZeros - 1)
      : Math.round(objectionsPct * 100) / 100

  return {
    thresholdPct,
    thresholdAmount,
    objectionsPct,
    objectionsAmount,
    objectionsPctFormatted,
  }
}

export type MotionProgress = ReturnType<typeof getMotionProgress>
