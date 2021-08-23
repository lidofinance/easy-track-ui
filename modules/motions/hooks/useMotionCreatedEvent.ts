import { useSWR } from 'modules/network/hooks/useSwr'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { getEventMotionCreated } from '../utils/getEventMotionCreation'

export function useMotionCreatedEvent(motionId: number | string) {
  const motionContract = ContractEasyTrack.useRpc()
  return useSWR(`motion-created-event-${motionId}`, () =>
    getEventMotionCreated(motionContract, motionId),
  )
}
