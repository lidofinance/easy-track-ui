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

  const dateOfEndMotionPeriod = moment.unix(
    currentPeriodData.periodEndTimestamp,
  )
  const dateOfStartMotionPeriod = moment.unix(
    currentPeriodData.periodStartTimestamp,
  )
  const isStartInNextPeriod = moment().isAfter(dateOfEndMotionPeriod)
  if (isStartInNextPeriod) {
    // will be more than 2
    const diffMonthCount = moment()
      .startOf('month')
      .diff(dateOfStartMotionPeriod.startOf('month'), 'months')
    // for period 3 => 3,4,5 = 1, 6,7,8 = 2, ...
    let periodRatio = Math.floor(diffMonthCount / limits.periodDurationMonths)

    const newPeriodStartTime = dateOfStartMotionPeriod.add(
      limits.periodDurationMonths * periodRatio,
      'M',
    )

    currentPeriodData = getNewPeriod({
      periodLimit: limits.limit,
      periodDurationMonths: limits.periodDurationMonths,
      newPeriodStartTime,
    })
  }

  const dateOfEndMotion = moment().add(motionDuration.toNumber(), 'seconds')
  const periodEnd = moment.unix(currentPeriodData.periodEndTimestamp)

  const isEndInNextPeriod = dateOfEndMotion.isAfter(periodEnd)

  if (isEndInNextPeriod && !isPending) {
    currentPeriodData = getNewPeriod({
      periodLimit: limits.limit,
      periodDurationMonths: limits.periodDurationMonths,
      newPeriodStartTime: moment
        .unix(currentPeriodData.periodStartTimestamp)
        .add(limits.periodDurationMonths, 'M')
        .startOf('month'),
    })
  }

  return {
    limits,
    periodData: currentPeriodData,
    motionDuration: motionDuration.toNumber() / 60 / 60, // hours
    isEndInNextPeriod,
  }
}
