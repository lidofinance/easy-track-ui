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
    <div>
      {callData.map(program => {
        const nodeOperatorId = program.nodeOperatorId.toNumber()
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId]
        return (
          <div key={nodeOperatorId}>
            Node operator <b>{nodeOperator ? nodeOperator.name : ''}</b> (id:{' '}
            {nodeOperatorId}) will be deactivated and <b>MANAGE_SIGNING_KEYS</b>{' '}
            role <br /> will be revoked from its&apos; manager address{' '}
            <AddressInlineWithPop address={program.managerAddress} />.
          </div>
        )
      })}
    </div>
  )
}
