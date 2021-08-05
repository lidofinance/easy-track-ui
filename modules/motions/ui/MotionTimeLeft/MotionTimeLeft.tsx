import moment from 'moment'
import 'moment-duration-format'
import { useState, useCallback, useEffect } from 'react'
import type { Motion } from 'modules/motions/types'

type Props = {
  motion: Motion
}

export function MotionTimeLeft({ motion }: Props) {
  const getTimeLeft = useCallback(() => {
    const now = Date.now()
    const diff = motion.startDate - now / 1000
    return (
      moment
        .duration(diff, 'seconds')
        // \xa0 is non-breaking space
        .format('h\xa0[hr]\xa0m\xa0[min]', { trim: 'all' })
    )
  }, [motion])

  const [timeLeft, setTimeLeftState] = useState(getTimeLeft())
  const setTimeLeft = useCallback(
    nextTimeLeft => {
      if (timeLeft !== nextTimeLeft) setTimeLeftState(nextTimeLeft)
    },
    [timeLeft],
  )

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft), 10000)
    return () => {
      clearInterval(interval)
    }
  }, [getTimeLeft, setTimeLeft])

  return <>{timeLeft}</>
}
