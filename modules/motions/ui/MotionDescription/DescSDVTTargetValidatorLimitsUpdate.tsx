import { UpdateTargetValidatorLimitsAbi } from 'generated'
import { NestProps } from './types'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'

// UpdateTargetValidatorLimits
export function DescSDVTTargetValidatorLimitsUpdate({
  callData,
}: NestProps<UpdateTargetValidatorLimitsAbi['decodeEVMScriptCallData']>) {
  const { data: nodeOperatorsList } = useSDVTNodeOperatorsList({
    withSummary: true,
  })
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = item.nodeOperatorId.toNumber()
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId]

        const nodeOperatorName = nodeOperator ? nodeOperator.name : ''

        return (
          <div key={nodeOperatorId}>
            Update Node Operator <b>{nodeOperatorName}</b> (id: {nodeOperatorId}
            ): set <b>isTargetLimitActive</b> to{' '}
            <b>{item.isTargetLimitActive ? 'true' : 'false'}</b>, set{' '}
            <b>targetValidatorsCount</b>
            {nodeOperator?.targetValidatorsCount
              ? ` from ${nodeOperator.targetValidatorsCount}`
              : ''}{' '}
            to {item.targetLimit.toString()}
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        )
      })}
    </>
  )
}
