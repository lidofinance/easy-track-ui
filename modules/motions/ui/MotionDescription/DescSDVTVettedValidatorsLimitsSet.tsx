import { SetVettedValidatorsLimitsAbi } from 'generated'
import { NestProps } from './types'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'

// SetVettedValidatorsLimits
export function DescSDVTVettedValidatorsLimitsSet({
  callData,
}: NestProps<SetVettedValidatorsLimitsAbi['decodeEVMScriptCallData']>) {
  const { data: nodeOperatorsList } = useSDVTNodeOperatorsList({
    withSummary: true,
  })
  return (
    <>
      {callData.map(item => {
        const nodeOperatorId = item.nodeOperatorId.toNumber()
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId]
        return (
          <div key={nodeOperatorId}>
            Set Node Operator <b>{nodeOperator ? nodeOperator.name : ''}</b>{' '}
            (id: {nodeOperatorId}) vetted validators limit{' '}
            {`from ${nodeOperator?.totalVettedValidators} to ${item.stakingLimit}`}
          </div>
        )
      })}
    </>
  )
}
