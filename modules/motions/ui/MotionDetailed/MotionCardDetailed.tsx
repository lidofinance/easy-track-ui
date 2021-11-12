import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useMotionProgress } from 'modules/motions/hooks/useMotionProgress'
import { useMotionTimeCountdown } from 'modules/motions/hooks/useMotionTimeCountdown'

import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { AddressWithPop } from 'modules/shared/ui/Common/AddressWithPop'
import { MotionDetailedObjections } from './MotionDetailedObjections'
import { MotionDetailedTime } from './MotionDetailedTime'
import { MotionDetailedCancelButton } from './MotionDetailedCancelButton'
import { MotionDescription } from '../MotionDescription'
import { MotionEvmScript } from '../MotionEvmScript'
import { MotionDetailedActions } from './MotionDetailedActions'
import {
  Card,
  Header,
  MotionNumber,
  MotionTitle,
  StatusLabel,
  StatusValue,
  HeaderAside,
  HeaderStatus,
  Description,
  InfoRow,
  InfoCol,
  InfoCell,
  InfoLabel,
  StartDateCell,
  StartDateValue,
  StartDateTime,
} from './MotionCardDetailedStyle'

import { Motion, MotionStatus } from 'modules/motions/types'
import { getMotionTypeByScriptFactory } from 'modules/motions/utils/getMotionType'
import { getMotionTypeDisplayName } from 'modules/motions/utils/getMotionTypeDisplayName'
import { getMotionDisplayStatus } from 'modules/motions/utils/getMotionDisplayStatus'
import { MOTION_ATTENTION_PERIOD } from 'modules/motions/constants'

type Props = {
  motion: Motion
  onInvalidate?: () => void
}

export function MotionCardDetailed({ motion, onInvalidate }: Props) {
  const currentChainId = useCurrentChain()
  const { walletAddress } = useWalletInfo()

  const progress = useMotionProgress(motion)

  const timeData = useMotionTimeCountdown(motion)
  const { isPassed, diff } = timeData

  const isArchived =
    motion.status !== MotionStatus.ACTIVE &&
    motion.status !== MotionStatus.PENDING
  const isAuthorConnected = walletAddress === motion.creator
  const isAttentionTime = diff <= motion.duration * MOTION_ATTENTION_PERIOD

  const motionType = getMotionTypeByScriptFactory(
    currentChainId,
    motion.evmScriptFactory,
  )
  const displayStatus = getMotionDisplayStatus({
    motion,
    progress,
    isAttentionTime,
  })

  return (
    <Card>
      <Header>
        <div>
          <MotionNumber>Motion #{motion.id}</MotionNumber>
          <MotionTitle>
            {getMotionTypeDisplayName(motionType)}
            {motionType === 'EvmUnrecognized' && (
              <>
                <br />
                {motion.evmScriptFactory}
              </>
            )}
          </MotionTitle>
        </div>
        <HeaderAside>
          <HeaderStatus>
            <StatusLabel>Status</StatusLabel>
            <StatusValue
              isActive={motion.status === MotionStatus.ACTIVE}
              isRejected={motion.status === MotionStatus.REJECTED}
            >
              {motion.status === MotionStatus.ACTIVE && isPassed
                ? MotionStatus.PENDING
                : motion.status}
            </StatusValue>
          </HeaderStatus>

          {isAuthorConnected && (
            <MotionDetailedCancelButton
              motion={motion}
              onFinish={onInvalidate}
            />
          )}
        </HeaderAside>
      </Header>

      <Description>
        <MotionDescription motion={motion} />
        <br />
        <br />
        <div>Snapshot: {motion.snapshotBlock}</div>
        <br />
        <div>Script:</div>
        <br />
        <MotionEvmScript motion={motion} />
      </Description>

      <InfoRow>
        <InfoCol>
          <MotionDetailedTime
            motion={motion}
            timeData={timeData}
            displayStatus={displayStatus}
          />

          <StartDateCell>
            <InfoLabel children="Started on:" />
            <StartDateValue>
              <FormattedDate date={motion.startDate} format="MMM DD, YYYY " />
              <StartDateTime>
                <FormattedDate date={motion.startDate} format="hh:mma" />
              </StartDateTime>
            </StartDateValue>
          </StartDateCell>
        </InfoCol>
        <InfoCol>
          <InfoCell>
            <MotionDetailedObjections motion={motion} />
          </InfoCell>

          <InfoCell>
            <InfoLabel children="Author Address:" />
            <AddressWithPop symbols={5} address={motion.creator} />
          </InfoCell>
        </InfoCol>
      </InfoRow>

      {!isArchived && (
        <MotionDetailedActions motion={motion} onFinish={onInvalidate} />
      )}
    </Card>
  )
}
