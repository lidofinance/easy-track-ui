import moment from 'moment'
import 'moment-duration-format'
import { useMemo } from 'react'

type Props = {
  value: number
  unit: Parameters<typeof moment.duration>[1]
}

export function FormattedDuration({ value, unit }: Props) {
  const formatted = useMemo(
    () =>
      moment.duration(value, unit).format('d [day] h [hr] m [min] s [sec]', {
        trim: 'all',
      }),
    [value, unit],
  )

  return <>{formatted}</>
}
