import { useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useMotionProgress } from 'modules/motions/hooks/useMotionProgress'

import { AddressWithPop } from 'modules/shared/ui/Common/AddressWithPop'
import { MotionTimeLeft } from '../MotionTimeLeft'
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
import type { Motion } from 'modules/motions/types'
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

  return (
    <Wrap
      onClick={goToDetails}
      isActive={motion.status === 'ACTIVE'}
      isSucceed={motion.status === 'ENACTED'}
      isDangered={motion.status === 'REJECTED'}
      isAttended={motion.status === 'PENDING'}
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
        <div>
          <CardTimeLabel>Time left</CardTimeLabel>
          <CardTimeValue>
            <MotionTimeLeft motion={motion} />
          </CardTimeValue>
        </div>
        <AddressWithPop symbols={4} address={motion.creator} />
      </Row>
    </Wrap>
  )
}
