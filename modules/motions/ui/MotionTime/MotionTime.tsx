import moment from 'moment'
import 'moment-duration-format'
import { useState, useCallback, useEffect } from 'react'
import type { Motion } from 'modules/motions/types'

type MotionTimeData = {
  isPassed: boolean
  time: number
  timeFormatted: string
}

type Props = {
  motion: Motion
  children?: (timeLeft: MotionTimeData) => React.ReactNode
}

export function MotionTime({ motion, children }: Props) {
  const getTimeLeft = useCallback((): MotionTimeData => {
    const now = Date.now() / 1000
    const diff = motion.startDate + motion.duration - now
    return {
      isPassed: diff < 0,
      time: diff,
      timeFormatted: moment
        .duration(Math.abs(diff), 'seconds')
        // \xa0 is non-breaking space
        .format('h\xa0[hr]\xa0m\xa0[min]', {
          trim: 'all',
          minValue: 1,
        }),
    }
  }, [motion])

  const [motionTimeData, setTimeLeftState] = useState(getTimeLeft())
  const setTimeLeft = useCallback(
    nextTimeLeft => {
      if (motionTimeData !== nextTimeLeft) setTimeLeftState(nextTimeLeft)
    },
    [motionTimeData],
  )

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft), 10000)
    return () => {
      clearInterval(interval)
    }
  }, [getTimeLeft, setTimeLeft])

  return (
    <>{children ? children(motionTimeData) : motionTimeData.timeFormatted}</>
  )
}
