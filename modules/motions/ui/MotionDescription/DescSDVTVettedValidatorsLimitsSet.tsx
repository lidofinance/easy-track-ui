import { SetVettedValidatorsLimitsAbi } from 'generated'
import { NestProps } from './types'
import { useNodeOperatorsList } from 'modules/motions/hooks'

// SetVettedValidatorsLimits
export function DescSDVTVettedValidatorsLimitsSet({
  callData,
  isOnChain,
}: NestProps<SetVettedValidatorsLimitsAbi['decodeEVMScriptCallData']>) {
  const { data: nodeOperatorsList } = useNodeOperatorsList('sdvt')
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
