import type { BigNumber } from 'ethers'
import type { ContractTypeEasyTrack } from 'modules/blockChain/contracts'

type MotionCreatedEvent = [BigNumber, string, string, string, string] & {
  _motionId: BigNumber
  _creator: string
  _evmScriptFactory: string
  _evmScriptCallData: string
  _evmScript: string
}

export async function getEventMotionCreated(
  motionContract: ContractTypeEasyTrack,
  motionId: string | number,
) {
  const filter = motionContract.filters.MotionCreated(motionId)
  const events = await motionContract.queryFilter(filter)
  const event = events[0]
  if (!events[0] || !event.decode) {
    throw new Error('Motion creation event parsing error')
  }
  const decoded = event.decode(event.data, event.topics)
  return decoded as MotionCreatedEvent
}
