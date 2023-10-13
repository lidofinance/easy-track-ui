import { DeactivateNodeOperatorsAbi } from 'generated'
import { NestProps } from './types'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

// DeactivateNodeOperators
export function DescSDVTNodeOperatorsDeactivate({
  callData,
}: NestProps<DeactivateNodeOperatorsAbi['decodeEVMScriptCallData']>) {
  const { data: nodeOperatorsList } = useSDVTNodeOperatorsList()
  return (
    <>
      {callData.map((program, index) => {
        const nodeOperatorId = program.nodeOperatorId.toNumber()
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId]
        return (
          <div key={nodeOperatorId}>
            Deactivate Node Operator{' '}
            <b>{nodeOperator ? nodeOperator.name : ''}</b> (id: {nodeOperatorId}
            ) and revoke <b>MANAGE_SIGNING_KEYS</b> role from{' '}
            <AddressInlineWithPop address={program.managerAddress} />
            {index === program.length - 1 ? '.' : '; '}
          </div>
        )
      })}
    </>
  )
}
