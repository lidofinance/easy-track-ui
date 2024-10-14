import { ActivateNodeOperatorsAbi } from 'generated'
import { NestProps } from './types'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useNodeOperatorsList } from 'modules/motions/hooks'
import { StakingModule } from 'modules/motions/types'

// ActivateNodeOperators
export function DescSDVTNodeOperatorsActivate({
  callData,
}: NestProps<ActivateNodeOperatorsAbi['decodeEVMScriptCallData']>) {
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
            Activate Node Operator{' '}
            <b>{nodeOperator ? nodeOperator.name : ''}</b> (id: {nodeOperatorId}
            ) and add <b>MANAGE_SIGNING_KEYS</b> role to{' '}
            <AddressInlineWithPop address={item.managerAddress} />
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        )
      })}
    </>
  )
}
