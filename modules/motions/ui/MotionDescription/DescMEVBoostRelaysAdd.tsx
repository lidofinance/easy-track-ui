import { AddMEVBoostRelaysAbi } from 'generated'
import { NestProps } from './types'

// AddMEVBoostRelays
export function DescMEVBoostRelaysAdd({
  callData,
}: NestProps<AddMEVBoostRelaysAbi['decodeEVMScriptCallData']>) {
  return (
    <>
      {callData.map((item, index) => {
        return (
          <div key={item.uri}>
            Add MEV Boost relay <b>{item.operator}</b> with params:
            <br />
            <b>URI:</b> {item.uri}
            <br />
            <b>Description:</b> {item.description}
            <br />
            <b>Mandatory:</b> {item.is_mandatory ? 'true' : 'false'}
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        )
      })}
    </>
  )
}
