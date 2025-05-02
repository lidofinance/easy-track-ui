import { UpdateTargetValidatorLimitsV2Abi } from 'generated'
import { NestProps } from './types'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'

// UpdateTargetValidatorLimitsV2
export function DescSDVTTargetValidatorLimitsUpdateV2({
  callData,
  isOnChain,
}: NestProps<UpdateTargetValidatorLimitsV2Abi['decodeEVMScriptCallData']>) {
  const { data: nodeOperatorsList } = useSDVTNodeOperatorsList({
    withSummary: true,
  })
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = item.nodeOperatorId.toNumber()
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId]
        const targetLimitMode = item.targetLimitMode.toNumber()

        let targetLimitModeDesc = 'disabled'
        if (targetLimitMode == 1) targetLimitModeDesc = 'soft'
        if (targetLimitMode == 2) targetLimitModeDesc = 'boosted exits'

        const nodeOperatorName = nodeOperator ? nodeOperator.name : ''

        if (targetLimitMode == 0) {
          return (
            <div key={nodeOperatorId}>
              Disable target validator limit for Node Operator{' '}
              <b>{nodeOperatorName}</b> (id: {nodeOperatorId})
              {index === callData.length - 1 ? '.' : '; '}
            </div>
          )
        }

        return (
          <div key={nodeOperatorId}>
            Set target validator limit for Node Operator{' '}
            <b>{nodeOperatorName}</b> (id: {nodeOperatorId}){' '}
            {nodeOperator && isOnChain
              ? `from ${nodeOperator.targetValidatorsCount} `
              : ''}
            {`to ${item.targetLimit} in ${targetLimitModeDesc} mode`}
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        )
      })}
    </>
  )
}
