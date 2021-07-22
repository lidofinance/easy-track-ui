import { IdenticonBadge } from '@lidofinance/lido-ui'
import { AddressPop } from '../AddressPop'

type BadgeProps = React.ComponentProps<typeof IdenticonBadge>

type Props = BadgeProps & {}

export function AddressWithPop({ ...badgeProps }: Props) {
  return (
    <AddressPop {...badgeProps}>
      <IdenticonBadge {...badgeProps} />
    </AddressPop>
  )
}
