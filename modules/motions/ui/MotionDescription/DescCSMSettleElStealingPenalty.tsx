import { CSMSettleElStealingPenaltyAbi } from 'generated'
import { pluralize } from 'modules/shared/utils/pluralize'
import { NestProps } from './types'

// CSMSettleElStealingPenalty
export function DescCSMSettleElStealingPenalty({
  callData,
}: NestProps<CSMSettleElStealingPenaltyAbi['decodeEVMScriptCallData']>) {
  return (
    <>
      Settle (confirm) EL Rewards Stealing penalty for the following CSM{' '}
      {pluralize(callData.length, 'operator')}:
      {callData.map(item => {
        const nodeOperatorId = item.toNumber()

        return <div key={nodeOperatorId}>NO #{nodeOperatorId}</div>
      })}
    </>
  )
}
