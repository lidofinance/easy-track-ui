import { UpdateTargetValidatorLimitsV1Abi } from 'generated'
import { NestProps } from './types'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { useSDVTNodeOperatorsSummaryMap } from 'modules/motions/hooks/useSDVTNodeOperatorsSummary'

// UpdateTargetValidatorLimitsV1
export function DescSDVTTargetValidatorLimitsUpdateV1({
  callData,
  isOnChain,
}: NestProps<UpdateTargetValidatorLimitsV1Abi['decodeEVMScriptCallData']>) {
  const { data: nodeOperatorsList } = useSDVTNodeOperatorsList()
  const { data: operatorsSummaryMap } = useSDVTNodeOperatorsSummaryMap()
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = item.nodeOperatorId.toNumber()
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId]

        const nodeOperatorName = nodeOperator ? nodeOperator.name : ''

        if (!item.isTargetLimitActive) {
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
              ? `from ${
                  operatorsSummaryMap?.[nodeOperator.id].targetValidatorsCount
                } `
              : ''}
            {`to ${item.targetLimit}`}
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        )
      })}
    </>
  )
}
