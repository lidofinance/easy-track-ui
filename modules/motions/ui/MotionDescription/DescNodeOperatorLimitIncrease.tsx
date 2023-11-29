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
  const registryType = getNodeOperatorRegistryType(motionType)
  const { data: nodeOperators } = useNodeOperatorsList(registryType)
  const nodeOperatorName = nodeOperators?.[nodeOperatorId].name ?? ''

  return (
    <div>
      {registryType === 'sandbox' ? '[Sandbox] ' : ''}Node operator{' '}
      <b>{nodeOperatorName}</b> (id: {nodeOperatorId}) wants to increase staking
      limit to {Number(callData._stakingLimit)}
    </div>
  )
}
