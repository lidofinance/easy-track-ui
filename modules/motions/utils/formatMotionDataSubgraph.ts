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
    enacted_at: rawMotion.enacted_at ? Number(rawMotion.enacted_at) : undefined,
    canceled_at: rawMotion.canceled_at
      ? Number(rawMotion.canceled_at)
      : undefined,
    rejected_at: rawMotion.rejected_at
      ? Number(rawMotion.rejected_at)
      : undefined,
  }
}
