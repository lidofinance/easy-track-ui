import { useNodeOperatorsList } from 'modules/motions/hooks/useNodeOperatorsList'
import { EvmIncreaseNodeOperatorStakingLimitAbi } from 'generated'
import { NestProps } from './types'

// NodeOperatorIncreaseLimit
export function DescNodeOperatorIncreaseLimit({
  callData,
}: NestProps<
  EvmIncreaseNodeOperatorStakingLimitAbi['decodeEVMScriptCallData']
>) {
  const nodeOperatorId = Number(callData._nodeOperatorId)
  const nodeOperators = useNodeOperatorsList()
  const nodeOperator = nodeOperators.data?.list[nodeOperatorId]
  return (
    <div>
      Node operator <b>{nodeOperator ? nodeOperator.name : ''}</b> (id:{' '}
      {nodeOperatorId}) wants to increase staking limit to{' '}
      {Number(callData._stakingLimit)}
    </div>
  )
}
