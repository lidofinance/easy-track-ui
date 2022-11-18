import clamp from 'lodash/clamp'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { LimitProgressBar } from './LimitProgressBar'

import {
  MotionLimitProgressWrapper,
  ProgressHeader,
  ProgressDesc,
  Limit,
  LimitDesc,
  ProgressPeriodWrapper,
} from './MotionLimitProgressStyle'

type MotionLimitProgressProps = {
  spentAmount: string
  totalLimit: string
  startDate: number
  endDate: number
  token?: string
  newAmount: number
}

export function MotionLimitProgress(props: MotionLimitProgressProps) {
  const { spentAmount, totalLimit, startDate, endDate, token, newAmount } =
    props

  const isValidNewValue = Number.isInteger(newAmount)
  const newSpentValue = isValidNewValue ? Number(spentAmount) + newAmount : 0

  const progressPercent = clamp(
    Number(spentAmount) / (Number(totalLimit) / 100),
    0,
    100,
  )
  const newValuePercent = clamp(
    Number(newSpentValue) / (Number(totalLimit) / 100),
    0,
    101,
  )

  const isNegative = newValuePercent > 100

  return (
    <MotionLimitProgressWrapper>
      <ProgressHeader>
        <ProgressDesc>Motion bank limit</ProgressDesc>
        <LimitDesc>
          <span>{newSpentValue}</span>{' '}
          <Limit>
            / {totalLimit} {token}
          </Limit>
        </LimitDesc>
      </ProgressHeader>
      <LimitProgressBar
        progress={progressPercent}
        negative={isNegative}
        newProgress={newValuePercent}
      />
      <ProgressPeriodWrapper>
        <span>
          <FormattedDate format="MMM DD, YYYY" date={startDate} />
        </span>
        <span>
          <FormattedDate format="MMM DD, YYYY" date={endDate} />
        </span>
      </ProgressPeriodWrapper>
    </MotionLimitProgressWrapper>
  )
}
