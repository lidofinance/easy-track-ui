import { Motion, MotionStatus } from '../types'
import { MotionProgress } from 'modules/motions/utils/getMotionProgress'
import { MotionDisplayStatus } from 'modules/motions/types'

type Args = {
  motion: Motion
  progress: MotionProgress | null
  isAttentionTime: boolean
}

export function getMotionDisplayStatus({
  motion,
  progress,
  isAttentionTime,
}: Args) {
  const hasObjections = progress && progress.objectionsPct > 0
  const isActive = motion.status === MotionStatus.ACTIVE
  const isPending = motion.status === MotionStatus.PENDING
  const isRejected = motion.status === MotionStatus.REJECTED
  const isEnacted = motion.status === MotionStatus.ENACTED

  if (isRejected || (hasObjections && isActive && !isAttentionTime)) {
    return MotionDisplayStatus.DANGER
  }

  if ((isActive || isPending) && isAttentionTime && hasObjections) {
    return MotionDisplayStatus.ATTENDED_DANGER
  }

  if ((isActive && isAttentionTime) || isPending) {
    return MotionDisplayStatus.ATTENDED
  }

  if (isActive) {
    return MotionDisplayStatus.ACTIVE
  }

  if (isEnacted) {
    return MotionDisplayStatus.ENACTED
  }

  return MotionDisplayStatus.DEFAULT
}
