import type { PromiseValue } from 'type-fest'
import type { EasyTrackMockAbi } from 'generated'
import type { Motion } from '../types'

type RawMotionData = PromiseValue<
  ReturnType<InstanceType<typeof EasyTrackMockAbi>['getMotions']>
>[0]

/*
  struct Motion {
    uint256 id;
    address evmScriptFactory;
    address creator;
    uint256 duration;
    uint256 startDate;
    uint256 snapshotBlock;
    uint256 objectionsThreshold;
    uint256 objectionsAmount;
    uint256 objectionsAmountPct;
    bytes32 evmScriptHash;
    bytes evmScriptCallData;
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
    evmScriptCallData: rawMotionData[10],
  }
}
