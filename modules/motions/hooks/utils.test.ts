import { BigNumber } from 'ethers'
import { calcPeriodData } from './utils'
import moment from 'moment'

const EIGTH_HOURS_SECONDS = 8 * 60 * 60
const MONTH_HOURS_SECONDS = 30 * 24 * 60 * 60

describe('calcPeriodData', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('Motion start in current period', () => {
    const motionDuration = BigNumber.from(EIGTH_HOURS_SECONDS) // seconds
    const limits = {
      limit: '1000',
      periodDurationMonths: 1,
    }
    const periodData = {
      alreadySpentAmount: '500',
      spendableBalanceInPeriod: '500',
      periodStartTimestamp: moment().unix() - EIGTH_HOURS_SECONDS,
      periodEndTimestamp: moment().unix() + EIGTH_HOURS_SECONDS * 2,
    }
    const isPending = false

    const result = calcPeriodData({
      motionDuration,
      limits,
      periodData,
      isPending,
    })

    expect(result).toEqual({
      limits,
      periodData,
      motionDuration: motionDuration.toNumber() / 60 / 60, // hours
      isEndInNextPeriod: false,
    })
  })

  it('Motion start in next period', () => {
    const motionDuration = BigNumber.from(EIGTH_HOURS_SECONDS) // seconds
    const limits = {
      limit: '1000',
      periodDurationMonths: 1,
    }
    const periodData = {
      alreadySpentAmount: '500',
      spendableBalanceInPeriod: '500',
      periodStartTimestamp: moment().unix() - EIGTH_HOURS_SECONDS * 10,
      periodEndTimestamp: moment().unix() - EIGTH_HOURS_SECONDS * 2,
    }
    const isPending = false

    const result = calcPeriodData({
      motionDuration,
      limits,
      periodData,
      isPending,
    })

    const expectPeriodData = {
      ...periodData,
      periodStartTimestamp: moment().startOf('month').unix(),
      periodEndTimestamp: moment()
        .startOf('month')
        .add(limits.periodDurationMonths, 'M')
        .startOf('month')
        .unix(),
      alreadySpentAmount: '0',
      spendableBalanceInPeriod: limits.limit,
    }

    expect(result).toEqual({
      limits,
      periodData: expectPeriodData,
      motionDuration: motionDuration.toNumber() / 60 / 60, // hours
      isEndInNextPeriod: false,
    })
  })

  it('Motion start in current and end in next period', () => {
    const motionDuration = BigNumber.from(EIGTH_HOURS_SECONDS) // seconds
    const limits = {
      limit: '1000',
      periodDurationMonths: 2,
    }

    const startOfMonth = moment().startOf('month')
    const endOfMonth = moment().endOf('month')
    const currentDateMock = moment(endOfMonth).subtract(5, 'hours')

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() =>
        new Date(currentDateMock.toISOString()).getTime(),
      )

    const periodData = {
      alreadySpentAmount: '500',
      spendableBalanceInPeriod: '500',
      periodStartTimestamp: moment(startOfMonth).subtract(1, 'month').unix(),
      periodEndTimestamp: moment(endOfMonth).unix(),
    }
    const isPending = false

    const result = calcPeriodData({
      motionDuration,
      limits,
      periodData,
      isPending,
    })

    const newStartTime = moment
      .unix(periodData.periodStartTimestamp)
      .add(limits.periodDurationMonths, 'M')
      .startOf('month')
    const newEndTime = moment(newStartTime)
      .add(limits.periodDurationMonths, 'M')
      .startOf('month')

    const expectPeriodData = {
      ...periodData,
      periodStartTimestamp: newStartTime.unix(),
      periodEndTimestamp: newEndTime.unix(),
      alreadySpentAmount: '0',
      spendableBalanceInPeriod: limits.limit,
    }

    expect(result).toEqual({
      limits,
      periodData: expectPeriodData,
      motionDuration: motionDuration.toNumber() / 60 / 60, // hours
      isEndInNextPeriod: true,
    })
  })

  it('Motion start in next and end in next period', () => {
    const motionDuration = BigNumber.from(EIGTH_HOURS_SECONDS) // seconds
    const limits = {
      limit: '1000',
      periodDurationMonths: 1,
    }
    const periodData = {
      alreadySpentAmount: '500',
      spendableBalanceInPeriod: '500',
      periodStartTimestamp: moment().unix() - EIGTH_HOURS_SECONDS * 10,
      periodEndTimestamp: moment().unix() - EIGTH_HOURS_SECONDS * 2,
    }
    const isPending = false

    const result = calcPeriodData({
      motionDuration,
      limits,
      periodData,
      isPending,
    })

    const newStartTime = moment().startOf('month')
    const newEndTime = moment(newStartTime)
      .add(limits.periodDurationMonths, 'M')
      .startOf('month')

    const expectPeriodData = {
      ...periodData,
      periodStartTimestamp: newStartTime.unix(),
      periodEndTimestamp: newEndTime.unix(),
      alreadySpentAmount: '0',
      spendableBalanceInPeriod: limits.limit,
    }

    expect(result).toEqual({
      limits,
      periodData: expectPeriodData,
      motionDuration: motionDuration.toNumber() / 60 / 60, // hours
      isEndInNextPeriod: false,
    })
  })

  it('Motion start in current and end in next period (pending)', () => {
    const motionDuration = BigNumber.from(EIGTH_HOURS_SECONDS) // seconds
    const limits = {
      limit: '1000',
      periodDurationMonths: 1,
    }
    const periodData = {
      alreadySpentAmount: '500',
      spendableBalanceInPeriod: '500',
      periodStartTimestamp: moment().unix() - EIGTH_HOURS_SECONDS,
      periodEndTimestamp: moment().unix() + EIGTH_HOURS_SECONDS / 2,
    }
    const isPending = true

    const result = calcPeriodData({
      motionDuration,
      limits,
      periodData,
      isPending,
    })

    expect(result).toEqual({
      limits,
      periodData,
      motionDuration: motionDuration.toNumber() / 60 / 60, // hours
      isEndInNextPeriod: true,
    })
  })

  it('Motion start in next N period and end in next period', () => {
    const motionDuration = BigNumber.from(MONTH_HOURS_SECONDS) // seconds

    const endOfMonth = moment().endOf('month')
    const currentDateMock = moment(endOfMonth).subtract(3, 'hours')
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() =>
        new Date(currentDateMock.toISOString()).getTime(),
      )

    const limits = {
      limit: '1000',
      periodDurationMonths: 1, // month
    }
    const periodData = {
      alreadySpentAmount: '500',
      spendableBalanceInPeriod: '500',
      periodStartTimestamp: moment().subtract(3, 'month').unix(),
      periodEndTimestamp: moment().subtract(2, 'month').unix(),
    }
    const isPending = false

    const result = calcPeriodData({
      motionDuration,
      limits,
      periodData,
      isPending,
    })

    const newStartTime = moment
      .unix(periodData.periodStartTimestamp)
      .add(4, 'M')
      .startOf('month')
    const newEndTime = moment(newStartTime)
      .add(limits.periodDurationMonths, 'M')
      .startOf('month')

    const expectPeriodData = {
      ...periodData,
      periodStartTimestamp: newStartTime.unix(),
      periodEndTimestamp: newEndTime.unix(),
      alreadySpentAmount: '0',
      spendableBalanceInPeriod: limits.limit,
    }

    expect(result).toEqual({
      limits,
      periodData: expectPeriodData,
      motionDuration: motionDuration.toNumber() / 60 / 60, // hours
      isEndInNextPeriod: true,
    })
  })

  it('Motion start in next N period and end in current', () => {
    const motionDuration = BigNumber.from(MONTH_HOURS_SECONDS) // seconds
    const limits = {
      limit: '1000',
      periodDurationMonths: 2, // month
    }
    const periodData = {
      alreadySpentAmount: '500',
      spendableBalanceInPeriod: '500',
      periodStartTimestamp: moment().subtract(6, 'month').unix(),
      periodEndTimestamp: moment().subtract(4, 'month').unix(),
    }
    const isPending = false

    const result = calcPeriodData({
      motionDuration,
      limits,
      periodData,
      isPending,
    })

    const newStartTime = moment
      .unix(periodData.periodStartTimestamp)
      .add(6, 'M')
      .startOf('month')
    const newEndTime = moment(newStartTime)
      .add(limits.periodDurationMonths, 'M')
      .startOf('month')

    const expectPeriodData = {
      ...periodData,
      periodStartTimestamp: newStartTime.unix(),
      periodEndTimestamp: newEndTime.unix(),
      alreadySpentAmount: '0',
      spendableBalanceInPeriod: limits.limit,
    }

    expect(result).toEqual({
      limits,
      periodData: expectPeriodData,
      motionDuration: motionDuration.toNumber() / 60 / 60, // hours
      isEndInNextPeriod: false,
    })
  })
})
