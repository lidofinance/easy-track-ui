import { useSWR } from 'modules/shared/hooks/useSwr'
import { useContractMotionRpc } from 'modules/motions/hooks/useContractMotion'
import { getMotionCreatedEvent } from '../utils/getMotionCreationEvent'

export function useMotionCreatedEvent(motionId: number | string) {
  const motionContract = useContractMotionRpc()
  return useSWR(`motion-created-event-${motionId}`, () =>
    getMotionCreatedEvent(motionContract, motionId),
  )
}
