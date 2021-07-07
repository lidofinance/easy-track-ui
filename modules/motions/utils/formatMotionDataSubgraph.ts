import { BigNumber } from 'ethers'
import type { Motion, RawMotionSubgraph } from '../types'

export function formatMotionDataSubgraph(rawMotion: RawMotionSubgraph): Motion {
  return {
    ...rawMotion,
    id: Number(rawMotion.id),
    duration: Number(rawMotion.duration),
    startDate: Number(rawMotion.startDate),
    snapshotBlock: Number(rawMotion.snapshotBlock),
    objectionsThreshold: Number(rawMotion.objectionsThreshold),
    objectionsAmount: BigNumber.from(rawMotion.objectionsAmount),
    objectionsAmountPct: Number(rawMotion.objectionsAmountPct),
  }
}
