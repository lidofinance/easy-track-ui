import { SubmitExitRequestHashesAbi } from 'generated'
import { useNodeOperatorsList } from 'modules/motions/hooks'
import { NestProps } from './types'

// SDVTSubmitExitRequestHashes
export function DescSDVTExitRequestHashesSubmit({
  callData,
}: NestProps<SubmitExitRequestHashesAbi['decodeEVMScriptCallData']>) {
  const { data: nodeOperators } = useNodeOperatorsList('sdvt')

  const groupedCallDataMap = callData.reduce((acc, item) => {
    const nodeOperatorId = item.nodeOpId.toNumber()

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!acc[nodeOperatorId]) {
      acc[nodeOperatorId] = []
    }
    acc[nodeOperatorId].push(item)
    return acc
  }, {} as Record<number, typeof callData>)

  const groupedCalldata = Object.values(groupedCallDataMap)

  return (
    <>
      <div>
        Submit exit request hashes for SDVT node operator
        {groupedCalldata.length > 1 ? 's' : ''}
        <br />
        {groupedCalldata.map((items, index) => {
          const nodeOpId = items[0].nodeOpId.toNumber()
          const nodeOperatorName = nodeOperators?.[nodeOpId].name
          return (
            <div key={index}>
              {nodeOperatorName} (id: {nodeOpId})
              {items.map(item => {
                return (
                  <ul key={item.valPubKeyIndex.toString()}>
                    <li>
                      <b>Validator Index:</b> {item.valIndex.toString()};
                    </li>
                    <li>
                      <b>Validator Key Index:</b>{' '}
                      {item.valPubKeyIndex.toString()};
                    </li>
                    <li>
                      <b>Validator Public Key:</b> {item.valPubkey}.
                    </li>
                  </ul>
                )
              })}
            </div>
          )
        })}
      </div>
    </>
  )
}
