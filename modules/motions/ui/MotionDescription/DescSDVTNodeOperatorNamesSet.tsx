import { SetNodeOperatorNamesAbi } from 'generated'
import { NestProps } from './types'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'

// SetNodeOperatorNames
export function DescSDVTNodeOperatorNamesSet({
  callData,
  isOnChain,
}: NestProps<SetNodeOperatorNamesAbi['decodeEVMScriptCallData']>) {
  const { data: nodeOperatorsList } = useSDVTNodeOperatorsList()
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = item.nodeOperatorId.toNumber()
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId]
        return (
          <div key={nodeOperatorId}>
            Change Node Operator{' '}
            <b>{nodeOperator && isOnChain ? nodeOperator.name : ''}</b> (id:{' '}
            {nodeOperatorId}) name to <b>{item.name}</b>
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        )
      })}
    </>
  )
}
