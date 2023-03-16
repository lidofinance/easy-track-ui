import { BigNumber } from 'ethers'
import moment from 'moment'

import { LimitsType, PeriodDataType } from 'modules/motions/utils'

const getNewPeriod = ({
  periodLimit,
  periodDurationMonths,
  newPeriodStartTime,
}: {
  periodLimit: string
  periodDurationMonths: number
  newPeriodStartTime: moment.Moment
}): PeriodDataType => {
  return {
    alreadySpentAmount: '0',
    periodStartTimestamp: newPeriodStartTime.unix(),
    periodEndTimestamp: newPeriodStartTime
      .add(periodDurationMonths, 'M')
      .startOf('month')
      .unix(),
    spendableBalanceInPeriod: periodLimit,
  }
}

export const calcPeriodData = ({
  motionDuration,
  limits,
  periodData,
  isPending,
}: {
  motionDuration: BigNumber
  limits: LimitsType
  periodData: PeriodDataType
  isPending?: boolean
}) => {
  let currentPeriodData = { ...periodData }

  const dateOfEndMotionPeriod = moment.unix(periodData.periodEndTimestamp)
  const isStartInNextPeriod = moment().isAfter(dateOfEndMotionPeriod)

  const dateOfEndMotion = moment().add(motionDuration.toNumber(), 'seconds')
  const periodEnd = isStartInNextPeriod
    ? moment()
        .startOf('month')
        .add(limits.periodDurationMonths, 'M')
        .startOf('month')
    : moment.unix(periodData.periodEndTimestamp)

  const isEndInNextPeriod = dateOfEndMotion.isAfter(periodEnd)

  if (isEndInNextPeriod && !isPending) {
    currentPeriodData = getNewPeriod({
      periodLimit: limits.limit,
      periodDurationMonths: limits.periodDurationMonths,
      newPeriodStartTime: moment
        .unix(periodData.periodStartTimestamp)
        .add(limits.periodDurationMonths, 'M')
        .startOf('month'),
    })
  }

  if (isStartInNextPeriod) {
    const diffMonthCount = moment()
      .startOf('month')
      .diff(dateOfEndMotionPeriod.startOf('month'), 'months')
    let periodRatio = Math.ceil(diffMonthCount / limits.periodDurationMonths)
    if (isEndInNextPeriod) periodRatio += 1

    const newPeriodStartTime =
      diffMonthCount >= limits.periodDurationMonths
        ? dateOfEndMotionPeriod.add(
            limits.periodDurationMonths * periodRatio,
            'M',
          )
        : dateOfEndMotionPeriod

    currentPeriodData = getNewPeriod({
      periodLimit: limits.limit,
      periodDurationMonths: limits.periodDurationMonths,
      newPeriodStartTime,
    })
  }

  return {
    limits,
    periodData: currentPeriodData,
    motionDuration: motionDuration.toNumber() / 60 / 60, // hours
    isEndInNextPeriod,
  }
}
