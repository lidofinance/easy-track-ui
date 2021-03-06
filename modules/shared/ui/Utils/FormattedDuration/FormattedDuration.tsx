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
      moment
        .duration(value, unit)
        // \xa0 is non-breaking space
        .format('h\xa0[hr]\xa0m\xa0[min]', {
          trim: 'all',
        }),
    [value, unit],
  )

  return <>{formatted}</>
}
