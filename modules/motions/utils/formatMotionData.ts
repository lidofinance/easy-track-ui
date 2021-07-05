import type { PromiseValue } from 'type-fest'
import type { EasyTrackAbi } from 'generated'
import type { Motion } from '../types'

type RawMotionData = PromiseValue<
  ReturnType<InstanceType<typeof EasyTrackAbi>['getMotions']>
>[0]

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

export function formatMotionData(rawMotionData: RawMotionData): Motion {
  return {
    id: Number(rawMotionData[0]),
    evmScriptFactory: rawMotionData[1] as Motion['evmScriptFactory'],
    creator: rawMotionData[2],
    duration: Number(rawMotionData[3]),
    startDate: Number(rawMotionData[4]),
    snapshotBlock: Number(rawMotionData[5]),
    objectionsThreshold: Number(rawMotionData[6]),
    objectionsAmount: rawMotionData[7],
    objectionsAmountPct: Number(rawMotionData[8]),
    evmScriptHash: rawMotionData[9],
  }
}
