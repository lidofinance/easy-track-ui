import { Motion, MotionStatus } from 'modules/motions/types'

export function getMotionStatus(motion: Motion) {
  const now = Date.now()
  const destination = (motion.startDate + motion.duration) * 1000

  if (now < destination) {
    return MotionStatus.Ongoing
  }

  if (destination <= now) {
    return MotionStatus.Pending
  }

  // TODO:
  // return 'Rejected'
  // return 'Enacted'
  // return 'Canceled'
}
