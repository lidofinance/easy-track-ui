import { ContractEasyTrack } from 'modules/blockChain/contracts'

export async function getMotionCallData(
  motionContract: ContractEasyTrack,
  motionId: string | number,
) {
  const filter = motionContract.filters.MotionCreated(motionId)
  const event = (await motionContract.queryFilter(filter))[0]
  if (!event.decode) {
    throw new Error('Motion creation event parsing error')
  }
  const callData = event.decode(event.data, event.topics)._evmScriptCallData
  return callData
}
