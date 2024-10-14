import { ChangeNodeOperatorManagersAbi } from 'generated'
import { NestProps } from './types'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useNodeOperatorsList } from 'modules/motions/hooks'
import { StakingModule } from 'modules/motions/types'

// ChangeNodeOperatorManagers
export function DescSDVTNodeOperatorManagersChange({
  callData,
}: NestProps<ChangeNodeOperatorManagersAbi['decodeEVMScriptCallData']>) {
  const { data: nodeOperatorsList } = useNodeOperatorsList({
    module: StakingModule.SimpleDVT,
  })
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
