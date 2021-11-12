import { trimAddress } from '@lidofinance/lido-ui'
import { AddressPop } from '../AddressPop'
import { Wrap } from './AddressInlineWithPopStyle'

type Props = {
  address: string
}

export function AddressInlineWithPop({ address }: Props) {
  return (
    <AddressPop address={address}>
      <Wrap children={trimAddress(address, 4)} />
    </AddressPop>
  )
}
