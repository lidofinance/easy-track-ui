import { RemoveMEVBoostRelaysAbi } from 'generated'
import { useMEVBoostRelays } from 'modules/motions/hooks/useMEVBoostRelays'
import { NestProps } from './types'

// RemoveMEVBoostRelays
export function DescMEVBoostRelaysRemove({
  callData,
  isOnChain,
}: NestProps<RemoveMEVBoostRelaysAbi['decodeEVMScriptCallData']>) {
  const { relaysMap, isRelaysDataLoading } = useMEVBoostRelays()

  if (isRelaysDataLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div>Remove MEV Boost Relay{callData.length > 1 ? 's' : ''}</div>
      <ul>
        {callData.map((uri, index) => {
          const relayInfo = isOnChain ? relaysMap?.get(uri) : undefined
          return (
            <li key={index}>
              <b>
                {relayInfo?.name
                  ? `${relayInfo.name} (${relayInfo.uriHost})`
                  : uri}
              </b>
            </li>
          )
        })}
      </ul>
    </>
  )
}
