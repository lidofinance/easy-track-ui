import { useNodeOperatorsList } from 'modules/motions/hooks/useNodeOperatorsList'
import { EvmIncreaseNodeOperatorStakingLimitAbi } from 'generated'
import { NestProps } from './types'
import { IncreaseLimitMotionType } from 'modules/motions/constants'
import { getStakingModuleByMotionType } from 'modules/motions/utils'

// IncreaseNodeOperatorLimit
export function DescNodeOperatorIncreaseLimit({
  callData,
  motionType,
}: NestProps<
  EvmIncreaseNodeOperatorStakingLimitAbi['decodeEVMScriptCallData']
> & {
  motionType: IncreaseLimitMotionType
}) {
  const nodeOperatorId = Number(callData._nodeOperatorId)
  const module = getStakingModuleByMotionType(motionType)
  const { data: nodeOperators } = useNodeOperatorsList({ module })
  const nodeOperatorName = nodeOperators?.[nodeOperatorId]?.name ?? ''

  return (
    <div>
      Node operator <b>{nodeOperatorName}</b> (id: {nodeOperatorId}) wants to
      increase staking limit to {Number(callData._stakingLimit)}
    </div>
  )
}
