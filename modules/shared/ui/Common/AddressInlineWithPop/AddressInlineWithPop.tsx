import { trimAddress } from '@lidofinance/lido-ui'
import { AddressPop } from '../AddressPop'
import { Wrap } from './AddressInlineWithPopStyle'

type Props = {
  address: string
  trim?: boolean
}

export function AddressInlineWithPop({ address, trim = true }: Props) {
  return (
    <AddressPop address={address}>
      <Wrap children={trim ? trimAddress(address, 4) : address} />
    </AddressPop>
  )
}
