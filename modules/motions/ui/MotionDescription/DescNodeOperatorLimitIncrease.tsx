import { useNodeOperatorsList } from 'modules/motions/hooks/useNodeOperatorsList'
import { EvmIncreaseNodeOperatorStakingLimitAbi } from 'generated'
import { NestProps } from './types'
import { IncreaseLimitMotionType } from 'modules/motions/constants'
import { getNodeOperatorRegistryType } from 'modules/motions/utils/getNodeOperatorRegistryType'

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
  const nodeOperators = useNodeOperatorsList(
    getNodeOperatorRegistryType(motionType),
  )
  const nodeOperator = nodeOperators.data?.list[nodeOperatorId]
  return (
    <div>
      Node operator <b>{nodeOperator ? nodeOperator.name : ''}</b> (id:{' '}
      {nodeOperatorId}) wants to increase staking limit to{' '}
      {Number(callData._stakingLimit)}
    </div>
  )
}
