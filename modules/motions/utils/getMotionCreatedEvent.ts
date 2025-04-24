import type { BigNumber } from 'ethers'
import { EasyTrackAbi } from 'generated'

const GET_LOG_BLOCK_LIMIT = 9999

type MotionCreatedEvent = [BigNumber, string, string, string, string] & {
  _motionId: BigNumber
  _creator: string
  _evmScriptFactory: string
  _evmScriptCallData: string
  _evmScript: string
}

export async function getMotionCreatedEvent(
  easyTrack: EasyTrackAbi,
  motionId: string | number,
  motionSnapshotBlock: number,
) {
  const filter = easyTrack.filters.MotionCreated(motionId)
  const events = await easyTrack.queryFilter(
    filter,
    motionSnapshotBlock,
    motionSnapshotBlock + GET_LOG_BLOCK_LIMIT,
  )
  const event = events[0]
  if (!events[0] || !event.decode) {
    throw new Error('Motion creation event parsing error')
  }
  const decoded = event.decode(event.data, event.topics)
  return decoded as MotionCreatedEvent
}
