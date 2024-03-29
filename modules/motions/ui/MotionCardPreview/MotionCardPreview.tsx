import { useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useMotionProgress } from 'modules/motions/hooks/useMotionProgress'
import { useMotionTimeCountdown } from 'modules/motions/hooks/useMotionTimeCountdown'

import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { AddressWithPop } from 'modules/shared/ui/Common/AddressWithPop'
import { MotionDescription } from '../MotionDescription'
import {
  Wrap,
  Row,
  CardTitle,
  CardDescription,
  CardStatus,
  CardProgress,
  Footer,
  FooterLabel,
  FooterValue,
} from './MotionCardPreviewStyle'

import * as urls from 'modules/network/utils/urls'
import { Motion, MotionStatus } from 'modules/motions/types'
import { getMotionTypeByScriptFactory } from 'modules/motions/utils/getMotionType'
import { getMotionTypeDisplayName } from 'modules/motions/utils/getMotionTypeDisplayName'
import { getMotionDisplayStatus } from 'modules/motions/utils/getMotionDisplayStatus'
import { MOTION_ATTENTION_PERIOD } from 'modules/motions/constants'

type Props = {
  motion: Motion
}

export function MotionCardPreview({ motion }: Props) {
  const router = useRouter()
  const { chainId } = useWeb3()

  const progress = useMotionProgress(motion)

  const timeData = useMotionTimeCountdown(motion)
  const { isPassed, diff, diffFormatted } = timeData

  const isArchived =
    motion.status !== MotionStatus.ACTIVE &&
    motion.status !== MotionStatus.PENDING
  const isAttentionTime = diff <= motion.duration * MOTION_ATTENTION_PERIOD
  const displayStatus = getMotionDisplayStatus({
    motion,
    progress,
    isAttentionTime,
  })

  const goToDetails = useCallback(() => {
    router.push(urls.motionDetails(motion.id))
  }, [router, motion.id])

  return (
    <Wrap displayStatus={displayStatus} onClick={goToDetails}>
      <CardTitle>
        #{motion.id}{' '}
        {getMotionTypeDisplayName(
          getMotionTypeByScriptFactory(chainId, motion.evmScriptFactory),
        )}
      </CardTitle>

      <CardDescription>
        <MotionDescription motion={motion} />
      </CardDescription>

      <Footer>
        <CardStatus>{motion.status}</CardStatus>

        <CardProgress>
          {isArchived ? (
            <FormattedDate
              format="MMM DD, YYYY"
              date={motion.startDate + motion.duration}
            />
          ) : isPassed ? (
            '—'
          ) : (
            diffFormatted
          )}
        </CardProgress>

        <Row>
          <div>
            <FooterLabel>Objections</FooterLabel>
            <FooterValue>
              {!progress ? 'Loading...' : `${progress.objectionsPctFormatted}%`}
            </FooterValue>
          </div>
          <AddressWithPop symbols={4} address={motion.creator} />
        </Row>
      </Footer>
    </Wrap>
  )
}
