import type { Motion, RawMotionOnchain } from '../types'
import { getMotionStatus } from './getMotionStatus'

/*
  struct Motion {
    id: BigNumber;
    evmScriptFactory: string;
    creator: string;
    duration: BigNumber;
    startDate: BigNumber;
    snapshotBlock: BigNumber;
    objectionsThreshold: BigNumber;
    objectionsAmount: BigNumber;
    evmScriptHash: string;
  }
*/

export function formatMotionDataOnchain(rawMotion: RawMotionOnchain): Motion {
  const formatted = {
    id: Number(rawMotion.id),
    evmScriptFactory: rawMotion.evmScriptFactory,
    creator: rawMotion.creator,
    duration: Number(rawMotion.duration),
    startDate: Number(rawMotion.startDate),
    snapshotBlock: Number(rawMotion.snapshotBlock),
    objectionsThreshold: Number(rawMotion.objectionsThreshold),
    objectionsAmount: rawMotion.objectionsAmount,
    evmScriptHash: rawMotion.evmScriptHash,
    isOnChain: true,
  }

  return {
    ...formatted,
    status: getMotionStatus(formatted as Motion),
  }
}
