import clamp from 'lodash/clamp'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { LimitProgressBar } from './LimitProgressBar'

import {
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
  showAmountChange?: boolean
}

export function MotionLimitProgress(props: MotionLimitProgressProps) {
  const {
    spentAmount,
    totalLimit,
    startDate,
    endDate,
    token,
    newAmount,
    showAmountChange,
  } = props

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

  const isAboveTheLimit = newValuePercent > 100

  const amount = showAmountChange ? (
    <span>
      {Number(spentAmount)} + {newAmount}
    </span>
  ) : (
    <span>{newSpentValue}</span>
  )

  return (
    <>
      <ProgressHeader>
        <ProgressDesc>Top up limit</ProgressDesc>
        <LimitDesc>
          {amount}{' '}
          <Limit>
            / {totalLimit} {token}
          </Limit>
        </LimitDesc>
      </ProgressHeader>
      <LimitProgressBar
        progress={progressPercent}
        negative={isAboveTheLimit}
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
    </>
  )
}
