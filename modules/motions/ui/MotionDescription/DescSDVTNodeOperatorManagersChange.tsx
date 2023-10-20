import { ChangeNodeOperatorManagersAbi } from 'generated'
import { NestProps } from './types'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

// ChangeNodeOperatorManagers
export function DescSDVTNodeOperatorManagersChange({
  callData,
}: NestProps<ChangeNodeOperatorManagersAbi['decodeEVMScriptCallData']>) {
  const { data: nodeOperatorsList } = useSDVTNodeOperatorsList()
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = item.nodeOperatorId.toNumber()
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId]
        return (
          <div key={nodeOperatorId}>
            Update Node Operator <b>{nodeOperator ? nodeOperator.name : ''}</b>{' '}
            (id: {nodeOperatorId}): revoke <b>MANAGE_SIGNING_KEYS</b> role from{' '}
            <AddressInlineWithPop address={item.oldManagerAddress} />, add{' '}
            <b>MANAGE_SIGNING_KEYS</b> role to{' '}
            <AddressInlineWithPop address={item.newManagerAddress} />
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        )
      })}
    </>
  )
}
