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
        .format('d\xa0[day]\xa0h\xa0[hr]\xa0m\xa0[min]\xa0s\xa0[sec]', {
          trim: 'all',
        }),
    [value, unit],
  )

  return <>{formatted}</>
}
