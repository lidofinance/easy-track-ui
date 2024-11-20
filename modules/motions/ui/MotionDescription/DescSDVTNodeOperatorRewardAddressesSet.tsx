import { SetNodeOperatorRewardAddressesAbi } from 'generated'
import { NestProps } from './types'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useNodeOperatorsList } from 'modules/motions/hooks'
import { StakingModule } from 'modules/motions/types'

// SetNodeOperatorRewardAddresses
export function DescSDVTNodeOperatorRewardAddressesSet({
  callData,
  isOnChain,
}: NestProps<SetNodeOperatorRewardAddressesAbi['decodeEVMScriptCallData']>) {
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
            Change reward address of Node Operator{' '}
            <b>{nodeOperator ? nodeOperator.name : ''}</b> (id: {nodeOperatorId}
            )
            {nodeOperator?.rewardAddress && isOnChain ? (
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
