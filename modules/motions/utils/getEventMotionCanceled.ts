import type { BigNumber } from 'ethers'
import type { ContractTypeEasyTrack } from 'modules/blockChain/types'

type MotionCreatedEvent = [BigNumber, string, string, string, string] & {
  _motionId: BigNumber
  _creator: string
  _evmScriptFactory: string
  _evmScriptCallData: string
  _evmScript: string
}

export async function getEventMotionCanceled(
  motionContract: ContractTypeEasyTrack,
  motionId: string | number,
) {
  const filter = motionContract.filters.MotionCanceled(motionId)
  const event = (await motionContract.queryFilter(filter))[0]
  if (!event.decode) {
    throw new Error('Motion canceled event parsing error')
  }
  const decoded = event.decode(event.data, event.topics)
  return decoded as MotionCreatedEvent
}
