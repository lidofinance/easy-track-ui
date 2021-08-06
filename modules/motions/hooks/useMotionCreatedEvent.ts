import { useSWR } from 'modules/shared/hooks/useSwr'
import { useContractMotionRpc } from 'modules/blockChain/hooks/useContractMotion'
import { getEventMotionCreated } from '../utils/getEventMotionCreation'

export function useMotionCreatedEvent(motionId: number | string) {
  const motionContract = useContractMotionRpc()
  return useSWR(`motion-created-event-${motionId}`, () =>
    getEventMotionCreated(motionContract, motionId),
  )
}
