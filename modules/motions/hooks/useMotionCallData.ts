import { useSWR } from 'modules/shared/hooks/useSwr'
import { useContractMotionRpc } from 'modules/motions/hooks/useContractMotion'
import { getMotionCallData } from '../utils/getMotionCallData'

export function useMotionCallData(motionId: number | string) {
  const motionContract = useContractMotionRpc()
  return useSWR(`motion-calldata-${motionId}`, () =>
    getMotionCallData(motionContract, motionId),
  )
}
