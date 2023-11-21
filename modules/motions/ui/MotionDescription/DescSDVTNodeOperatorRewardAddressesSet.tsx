import { SetNodeOperatorRewardAddressesAbi } from 'generated'
import { NestProps } from './types'
import { useSDVTNodeOperatorsList } from 'modules/motions/hooks/useSDVTNodeOperatorsList'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'

// SetNodeOperatorRewardAddresses
export function DescSDVTNodeOperatorRewardAddressesSet({
  callData,
}: NestProps<SetNodeOperatorRewardAddressesAbi['decodeEVMScriptCallData']>) {
  const { data: nodeOperatorsList } = useSDVTNodeOperatorsList()
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = item.nodeOperatorId.toNumber()
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId]
        return (
          <div key={nodeOperatorId}>
            Change reward address of Node Operator{' '}
            <b>{nodeOperator ? nodeOperator.name : ''}</b> (id: {nodeOperatorId}
            )
            {nodeOperator?.rewardAddress ? (
              <>
                {' '}
                from{' '}
                <AddressInlineWithPop address={nodeOperator.rewardAddress} />
              </>
            ) : null}{' '}
            to <AddressInlineWithPop address={item.rewardAddress} />
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        )
      })}
    </>
  )
}
