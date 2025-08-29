import { SubmitExitRequestHashesAbi } from 'generated'
import { useNodeOperatorsList } from 'modules/motions/hooks'
import { NestProps } from './types'

// CuratedSubmitExitRequestHashes
export function DescCuratedExitRequestHashesSubmit({
  callData,
}: NestProps<SubmitExitRequestHashesAbi['decodeEVMScriptCallData']>) {
  const nodeOperatorId = callData[0].nodeOpId.toNumber()
  const { data: nodeOperators } = useNodeOperatorsList('curated')
  const nodeOperatorName = nodeOperators?.[nodeOperatorId]?.name ?? ''

  return (
    <div>
      Submit exit request hashes for node operator {nodeOperatorName} (id:{' '}
      {nodeOperatorId})
      <br />
      {callData.map(item => {
        return (
          <ul key={item.valPubKeyIndex.toString()}>
            <li>
              <b>Validator Index:</b> {item.valIndex.toString()};
            </li>
            <li>
              <b>Validator Key Index:</b> {item.valPubKeyIndex.toString()};
            </li>
            <li>
              <b>Validator Public Key:</b> {item.valPubkey}.
            </li>
          </ul>
        )
      })}
    </div>
  )
}
