import { Text, TextSize, TextWeight } from 'modules/shared/ui/Common/Text'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { FormattedDuration } from 'modules/shared/ui/Utils/FormattedDuration'

import type { Motion } from 'modules/motions/types'

type Props = {
  motion: Motion
  fontSize: TextSize
  fontWeight: TextWeight
  showYear?: boolean
}

export function MotionDate({ motion, fontSize, fontWeight, showYear }: Props) {
  const format = showYear ? 'YYYY MMM DD h:mma' : 'DD MMM h:mma'
  return (
    <Text size={fontSize} weight={fontWeight}>
      <FormattedDate date={motion.startDate} format={format} />
      <span> –</span>
      <br />
      <span>
        <FormattedDate
          date={motion.startDate + motion.duration}
          format={format}
        />{' '}
        <Text as="span" size={fontSize} weight={400}>
          (<FormattedDuration value={motion.duration} unit="seconds" />
          &nbsp;total)
        </Text>
      </span>
    </Text>
  )
}
