import { EditMEVBoostRelaysAbi } from 'generated'
import { IMEVBoostRelayAllowedList } from 'generated/AddMEVBoostRelaysAbi'
import { useMEVBoostRelays } from 'modules/motions/hooks/useMEVBoostRelays'
import { MEVBoostRelay } from 'modules/motions/types'
import { NestProps } from './types'

type RowProps = {
  change: IMEVBoostRelayAllowedList.RelayStructOutput
  relayInfo: MEVBoostRelay | undefined
}

const RelayDescriptionRow = ({ change, relayInfo }: RowProps) => {
  if (relayInfo) {
    return (
      <div>
        — Edit relay <b>{relayInfo.name}</b> params:
        <ul>
          {relayInfo.name !== change.operator && (
            <li>
              <b>Name:</b> {relayInfo.name} &gt; {change.operator};
            </li>
          )}
          {relayInfo.description !== change.description && (
            <li>
              <b>Description:</b> {relayInfo.description} &gt;{' '}
              {change.description};
            </li>
          )}
          {relayInfo.isMandatory !== change.is_mandatory && (
            <li>
              <b>Mandatory:</b> {relayInfo.isMandatory ? 'true' : 'false'} &gt;
              {change.is_mandatory ? 'true' : 'false'};
            </li>
          )}
        </ul>
      </div>
    )
  }

  return (
    <div>
      — Edit relay <b>{change.uri}</b> params:
      <ul>
        <li>
          <b>Name:</b> {change.operator}
        </li>
        <li>
          <b>Description:</b> {change.description}
        </li>
        <li>
          <b>Mandatory:</b> {change.is_mandatory ? 'true' : 'false'}
        </li>
      </ul>
    </div>
  )
}

// EditMEVBoostRelays
export function DescMEVBoostRelaysEdit({
  callData,
  isOnChain,
}: NestProps<EditMEVBoostRelaysAbi['decodeEVMScriptCallData']>) {
  const { relaysMap, isRelaysDataLoading } = useMEVBoostRelays()

  if (isRelaysDataLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {callData.map((change, index) => (
        <RelayDescriptionRow
          key={index}
          change={change}
          relayInfo={isOnChain ? relaysMap?.get(change.uri) : undefined}
        />
      ))}
    </>
  )
}
