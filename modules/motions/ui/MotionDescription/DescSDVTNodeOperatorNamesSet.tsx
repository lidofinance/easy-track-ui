import { SetNodeOperatorNamesAbi } from 'generated'
import { NestProps } from './types'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'

// SetNodeOperatorNames
export function DescSDVTNodeOperatorNamesSet({
  callData,
}: NestProps<SetNodeOperatorNamesAbi['decodeEVMScriptCallData']>) {
  const { data: nodeOperatorsList } = useSDVTNodeOperatorsList()
  return (
    <>
      {callData.map((program, index) => {
        const nodeOperatorId = program.nodeOperatorId.toNumber()
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId]
        return (
          <div key={nodeOperatorId}>
            Change Node Operator <b>{nodeOperator ? nodeOperator.name : ''}</b>{' '}
            (id: {nodeOperatorId}) name to <b>{program.name}</b>
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        )
      })}
    </>
  )
}
