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

  const isSucceed = motion.status === MotionStatus.ENACTED
  const isDangered =
    !isSucceed &&
    (motion.status === MotionStatus.REJECTED ||
      Boolean(progress && progress.objectionsPct > 0))

  return (
    <ObjectionsInfo isSucceed={isSucceed} isDangered={isDangered}>
      <ObjectionsTitle>Objections:</ObjectionsTitle>
      <ObjectionsValue>
        {!progress ? (
          'Loading...'
        ) : (
          <>
            <span>
              {progress.objectionsAmount.toLocaleString('en-EN')}/
              {progress.thresholdAmount.toLocaleString('en-EN')}
            </span>
            <ObjectionsThreshold />
          </>
        )}
      </ObjectionsValue>
      <ObjectionsPercents>
        {!progress ? '...' : `${progress.objectionsPctFormatted}%`}
      </ObjectionsPercents>
    </ObjectionsInfo>
  )
}
