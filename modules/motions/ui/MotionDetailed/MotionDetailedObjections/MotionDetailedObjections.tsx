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

  return (
    <ObjectionsInfo isRejected={motion.status === MotionStatus.REJECTED}>
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
