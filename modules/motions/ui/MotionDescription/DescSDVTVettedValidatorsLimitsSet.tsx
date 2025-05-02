import { SetVettedValidatorsLimitsAbi } from 'generated'
import { NestProps } from './types'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'

// SetVettedValidatorsLimits
export function DescSDVTVettedValidatorsLimitsSet({
  callData,
  isOnChain,
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
            {nodeOperator && isOnChain
              ? `from ${nodeOperator.totalVettedValidators} `
              : ''}
            {`to ${item.stakingLimit}`}
          </div>
        )
      })}
    </>
  )
}
