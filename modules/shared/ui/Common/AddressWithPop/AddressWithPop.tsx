import { IdenticonBadge } from '@lidofinance/lido-ui'
import { AddressPop } from '../AddressPop'
import { BadgeWrap } from './AddressWithPopStyle'

type BadgeProps = React.ComponentProps<typeof IdenticonBadge>

type Props = BadgeProps & {}

export function AddressWithPop({ ...badgeProps }: Props) {
  return (
    <AddressPop {...badgeProps}>
      <BadgeWrap>
        <IdenticonBadge style={{ margin: 0 }} diameter={24} {...badgeProps} />
      </BadgeWrap>
    </AddressPop>
  )
}
