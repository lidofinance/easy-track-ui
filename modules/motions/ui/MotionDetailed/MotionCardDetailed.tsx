import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { AddressWithPop } from 'modules/shared/ui/Common/AddressWithPop'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { MotionDetailedObjections } from './MotionDetailedObjections'
import { MotionDetailedCancelButton } from './MotionDetailedCancelButton'
import { MotionDescription } from '../MotionDescription'
import { MotionEvmScript } from '../MotionEvmScript'
import { MotionDetailedActions } from './MotionDetailedActions'
import { MotionTime } from '../MotionTime'
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
  TimeLeft,
  DateLabel,
} from './MotionCardDetailedStyle'

import { Motion, MotionStatus } from 'modules/motions/types'
import { getMotionTypeByScriptFactory } from 'modules/motions/utils/getMotionType'
import { getMotionTypeDisplayName } from 'modules/motions/utils/getMotionTypeDisplayName'

type Props = {
  motion: Motion
}

export function MotionCardDetailed({ motion }: Props) {
  const currentChainId = useCurrentChain()
  const { walletAddress } = useWalletInfo()

  const isMotionLiving =
    motion.status === MotionStatus.ACTIVE ||
    motion.status === MotionStatus.PENDING
  const isAuthorConnected = walletAddress === motion.creator
  const motionType = getMotionTypeByScriptFactory(
    currentChainId,
    motion.evmScriptFactory,
  )

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
              {motion.status}
            </StatusValue>
          </HeaderStatus>

          {isAuthorConnected && <MotionDetailedCancelButton motion={motion} />}
        </HeaderAside>
      </Header>

      <Description>
        <MotionDescription motion={motion} />
        <br />
        <div>Snapshot: {motion.snapshotBlock}</div>
      </Description>

      <Description>
        <br />
        <div>Script:</div>
        <br />
        <div style={{ marginBottom: 66 }}>
          <MotionEvmScript motion={motion} />
        </div>
      </Description>

      <InfoRow>
        <InfoCol>
          <MotionDetailedObjections motion={motion} />
        </InfoCol>
        <InfoCol>
          <InfoCell>
            <InfoLabel children="Author" />
            <AddressWithPop symbols={5} address={motion.creator} />
          </InfoCell>

          <MotionTime
            motion={motion}
            children={({ isPassed, timeFormatted }) => (
              <InfoCell>
                <InfoLabel>{isPassed ? 'Time passed' : 'Time left'}</InfoLabel>
                <TimeLeft>
                  {timeFormatted}
                  {isPassed ? ' ago' : ''}
                </TimeLeft>
              </InfoCell>
            )}
          />

          <InfoCell>
            <InfoLabel>
              <DateLabel>From: </DateLabel>
              <FormattedDate
                date={motion.startDate}
                format="h:mma MMM DD YYYY"
              />
              <br />
              <DateLabel>To: </DateLabel>
              <FormattedDate
                date={motion.startDate + motion.duration}
                format="h:mma MMM DD YYYY"
              />
            </InfoLabel>
          </InfoCell>
        </InfoCol>
      </InfoRow>

      {isMotionLiving && <MotionDetailedActions motion={motion} />}
    </Card>
  )
}
