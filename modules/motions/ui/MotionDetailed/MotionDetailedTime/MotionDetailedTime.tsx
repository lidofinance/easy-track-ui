import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { Wrap, Title, Value, Subvalue } from './MotionDetailedTimeStyle'

import {
  Motion,
  MotionStatus,
  MotionDisplayStatus,
} from 'modules/motions/types'
import type { MotionTimeData } from 'modules/motions/hooks/useMotionTimeCountdown'

type Props = {
  motion: Motion
  timeData: MotionTimeData
  displayStatus: MotionDisplayStatus
}

export function MotionDetailedTime({ motion, timeData, displayStatus }: Props) {
  const { isPassed, diffFormatted } = timeData

  const isArchived =
    motion.status !== MotionStatus.ACTIVE &&
    motion.status !== MotionStatus.PENDING

  if (isArchived) {
    let title = 'Ended at:'
    let date = motion.startDate + motion.duration
    if (motion.status === MotionStatus.ENACTED) {
      title = 'Enacted at:'
      date = motion.enacted_at!
    } else if (motion.status === MotionStatus.CANCELED) {
      title = 'Canceled at:'
      date = motion.canceled_at!
    } else if (motion.status === MotionStatus.REJECTED) {
      title = 'Rejected at:'
      date = motion.rejected_at!
    }
    return (
      <Wrap displayStatus={displayStatus}>
        <Title>{title}</Title>
        <Value>
          <FormattedDate format="MMM DD, YYYY" date={date} />
        </Value>
        <Subvalue>
          <FormattedDate format="hh:mm a" date={date} />
        </Subvalue>
      </Wrap>
    )
  }

  if (isPassed) {
    return (
      <Wrap displayStatus={displayStatus}>
        <Title>Time left:</Title>
        <Value>—</Value>
      </Wrap>
    )
  }

  return (
    <Wrap displayStatus={displayStatus}>
      <Title>Time left:</Title>
      <Value>{diffFormatted}</Value>
    </Wrap>
  )
}
