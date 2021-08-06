import { useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useMotionProgress } from 'modules/motions/hooks/useMotionProgress'

import { AddressWithPop } from 'modules/shared/ui/Common/AddressWithPop'
import { MotionTime } from '../MotionTime'
import { MotionDescription } from '../MotionDescription'
import {
  Wrap,
  Row,
  CardTitle,
  CardDescription,
  CardStatus,
  CardProgress,
  CardTimeLabel,
  CardTimeValue,
} from './MotionCardPreviewStyle'

import * as urls from 'modules/shared/utils/urls'
import { Motion, MotionStatus } from 'modules/motions/types'
import { getMotionTypeByScriptFactory } from 'modules/motions/utils/getMotionType'
import { getMotionTypeDisplayName } from 'modules/motions/utils/getMotionTypeDisplayName'

type Props = {
  motion: Motion
}

export function MotionCardPreview({ motion }: Props) {
  const router = useRouter()
  const currentChainId = useCurrentChain()

  const goToDetails = useCallback(() => {
    router.push(urls.motionDetails(motion.id))
  }, [router, motion.id])

  const progress = useMotionProgress(motion)

  const isDangered = Boolean(
    motion.status === MotionStatus.REJECTED ||
      (progress && progress.objectionsPct > 0),
  )

  return (
    <Wrap
      onClick={goToDetails}
      isActive={!isDangered && motion.status === MotionStatus.ACTIVE}
      isSucceed={motion.status === MotionStatus.ENACTED}
      isDangered={isDangered}
      isAttended={!isDangered && motion.status === MotionStatus.PENDING}
    >
      <CardTitle>
        #{motion.id}{' '}
        {getMotionTypeDisplayName(
          getMotionTypeByScriptFactory(currentChainId, motion.evmScriptFactory),
        )}
      </CardTitle>

      <CardDescription>
        <MotionDescription motion={motion} />
      </CardDescription>

      <CardProgress>
        {!progress ? 'Loading...' : `${progress.objectionsPct}%`}
      </CardProgress>

      <CardStatus>{motion.status}</CardStatus>

      <Row>
        <MotionTime
          motion={motion}
          children={({ isPassed, timeFormatted }) => (
            <div>
              <CardTimeLabel>
                {isPassed ? 'Time passed' : 'Time left'}
              </CardTimeLabel>
              <CardTimeValue>
                {timeFormatted}
                {isPassed ? ' ago' : ''}
              </CardTimeValue>
            </div>
          )}
        />
        <AddressWithPop symbols={4} address={motion.creator} />
      </Row>
    </Wrap>
  )
}
