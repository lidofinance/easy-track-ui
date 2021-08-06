import { useMotionProgress } from 'modules/motions/hooks/useMotionProgress'

import {
  ObjectionsInfo,
  ObjectionsTitle,
  ObjectionsPercents,
  ObjectionsValue,
  ObjectionsThreshold,
} from './MotionDetailedObjectionsStyle'

import { Motion, MotionStatus } from 'modules/motions/types'

type Props = {
  motion: Motion
}

export function MotionDetailedObjections({ motion }: Props) {
  const progress = useMotionProgress(motion)

  const isDangered = Boolean(
    motion.status === MotionStatus.REJECTED ||
      (progress && progress.objectionsPct > 0),
  )

  return (
    <ObjectionsInfo isDangered={isDangered}>
      <ObjectionsTitle>Objections</ObjectionsTitle>
      <ObjectionsPercents>
        {!progress ? '...' : `${progress.objectionsPct}%`}
      </ObjectionsPercents>
      <ObjectionsValue>
        {!progress ? (
          'Loading...'
        ) : (
          <>
            <span>
              {progress.objectionsAmount}/{progress.thresholdAmount}
            </span>
            <ObjectionsThreshold />
          </>
        )}
      </ObjectionsValue>
    </ObjectionsInfo>
  )
}
