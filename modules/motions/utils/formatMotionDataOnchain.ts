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
    objectionsAmountPct: BigNumber;
    evmScriptHash: string;
  }
*/

export function formatMotionDataOnchain(rawMotion: RawMotionOnchain): Motion {
  const formatted = {
    id: Number(rawMotion[0]),
    evmScriptFactory: rawMotion[1],
    creator: rawMotion[2],
    duration: Number(rawMotion[3]),
    startDate: Number(rawMotion[4]),
    snapshotBlock: Number(rawMotion[5]),
    objectionsThreshold: Number(rawMotion[6]),
    objectionsAmount: rawMotion[7],
    objectionsAmountPct: Number(rawMotion[8]),
    evmScriptHash: rawMotion[9],
  }

  return {
    ...formatted,
    status: getMotionStatus(formatted as Motion),
  }
}
