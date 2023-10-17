import { AddNodeOperatorsAbi } from 'generated'
import { NestProps } from './types'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

// AddNodeOperators
export function DescSDVTNodeOperatorsAdd({
  callData,
}: NestProps<AddNodeOperatorsAbi['decodeEVMScriptCallData']>) {
  const { nodeOperators, nodeOperatorsCount } = callData
  return (
    <>
      {nodeOperators.map((nodeOperator, index) => {
        return (
          <div key={nodeOperator.managerAddress}>
            Add Node Operator <b>{nodeOperator.name}</b>(id:{' '}
            {Number(nodeOperatorsCount) + index + 1})
            <AddressInlineWithPop address={nodeOperator.rewardAddress} /> and
            set <b>MANAGE_SIGNING_KEYS</b> role to{' '}
            <AddressInlineWithPop address={nodeOperator.managerAddress} />
            {index === nodeOperators.length - 1 ? '.' : '; '}
          </div>
        )
      })}
    </>
  )
}
