import moment from 'moment'
import 'moment-duration-format'
import { useState, useCallback, useEffect } from 'react'
import type { Motion } from 'modules/motions/types'

export type MotionTimeData = {
  isPassed: boolean
  diff: number
  diffFormatted: string
}

export function useMotionTimeCountdown(motion: Motion) {
  const getTimeLeft = useCallback((): MotionTimeData => {
    const now = Date.now() / 1000
    const diff = motion.startDate + motion.duration - now
    return {
      isPassed: diff < 0,
      diff: diff,
      diffFormatted: moment
        .duration(Math.abs(diff), 'seconds')
        // @ts-ignore
        .format('h\xa0[h] m\xa0[min]', {
          trim: 'all',
          minValue: 1,
        }),
    }
  }, [motion])

  const [timeData, setTimeLeftState] = useState(getTimeLeft())
  const { isPassed, diffFormatted } = timeData

  const setTimeLeft = useCallback(
    (nextTimeLeft: MotionTimeData) => {
      if (diffFormatted !== nextTimeLeft.diffFormatted) {
        setTimeLeftState(nextTimeLeft)
      }
    },
    [diffFormatted],
  )

  useEffect(() => {
    if (isPassed) return
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 10000)
    return () => {
      clearInterval(interval)
    }
  }, [isPassed, getTimeLeft, setTimeLeft])

  return timeData
}
