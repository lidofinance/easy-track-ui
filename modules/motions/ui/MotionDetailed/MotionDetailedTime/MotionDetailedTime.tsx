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

  const endDate = motion.startDate + motion.duration

  if (isArchived) {
    return (
      <Wrap displayStatus={displayStatus}>
        <Title>Ended at:</Title>
        <Value>
          <FormattedDate format="DD MMM YYYY" date={endDate} />
        </Value>
        <Subvalue>
          <FormattedDate format="hh:mm a" date={endDate} />
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
