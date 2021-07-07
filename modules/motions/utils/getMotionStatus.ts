import { Motion, MotionStatus } from 'modules/motions/types'

export function getMotionStatus(motion: Motion) {
  const now = Date.now()
  const destination = (motion.startDate + motion.duration) * 1000

  if (now < destination) {
    return MotionStatus.ACTIVE
  }

  if (destination <= now) {
    return MotionStatus.PENDING
  }

  return motion.status
}
