import { ActivateNodeOperatorsAbi } from 'generated'
import { NestProps } from './types'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

// ActivateNodeOperators
export function DescSDVTNodeOperatorsActivate({
  callData,
}: NestProps<ActivateNodeOperatorsAbi['decodeEVMScriptCallData']>) {
  const { data: nodeOperatorsList } = useSDVTNodeOperatorsList()
  return (
    <>
      {callData.map((program, index) => {
        const nodeOperatorId = program.nodeOperatorId.toNumber()
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId]
        return (
          <div key={nodeOperatorId}>
            Activate Node Operator{' '}
            <b>{nodeOperator ? nodeOperator.name : ''}</b> (id: {nodeOperatorId}
            ) and set <b>MANAGE_SIGNING_KEYS</b> role to{' '}
            <AddressInlineWithPop address={program.managerAddress} />
            {index === program.length - 1 ? '.' : '; '}
          </div>
        )
      })}
    </>
  )
}