import { useEffect } from 'react'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useMotionDetailed } from 'modules/motions/providers/hooks/useMotionDetaled'
import { ContractVaultHub } from 'modules/blockChain/contracts'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { AddressWithPop } from 'modules/shared/ui/Common/AddressWithPop'
import {
  getMotionDisplayStatus,
  getMotionTypeByScriptFactory,
} from 'modules/motions/utils'
import { EvmUnrecognized } from 'modules/motions/evmAddresses'
import { MotionDetailedObjections } from './MotionDetailedObjections'
import { MotionDetailedTime } from './MotionDetailedTime'
import { MotionDetailedCancelButton } from './MotionDetailedCancelButton'
import { MotionDescription } from '../MotionDescription'
import { MotionEvmScript } from '../MotionEvmScript'
import { MotionDetailedLimits } from './MotionDetailedLimits'
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
  StonksButton,
} from './MotionCardDetailedStyle'

import { Motion, MotionStatus, MotionType } from 'modules/motions/types'
import { MOTION_ATTENTION_PERIOD } from 'modules/motions/constants'
import { stonksInstance } from 'modules/network/utils/urls'
import Link from 'next/link'

// Motion types that require a fresh report before enactment
const MOTION_TYPES_REQUIRING_REPORT = new Set<MotionType | EvmUnrecognized>([
  MotionType.UpdateVaultsFeesInOperatorGrid,
  MotionType.ForceValidatorExitsInVaultHub,
  MotionType.SocializeBadDebtInVaultHub,
])

type Props = {
  motion: Motion
  onInvalidate?: () => void
}

export function MotionCardDetailed({ motion, onInvalidate }: Props) {
  const { chainId, walletAddress } = useWeb3()
  const {
    progress,
    isArchived,
    pending,
    timeData,
    motionDisplaydName,
    stonksRecipientAddress,
    callDataDecoded,
  } = useMotionDetailed()
  const { isPassed, diff } = timeData

  useEffect(() => {
    if (motion.status === MotionStatus.ACTIVE && isPassed) {
      onInvalidate?.()
    }
  }, [isPassed, motion.status, onInvalidate])

  const isAuthorConnected = walletAddress === motion.creator
  const isAttentionTime = diff <= motion.duration * MOTION_ATTENTION_PERIOD

  const motionType = getMotionTypeByScriptFactory(
    chainId,
    motion.evmScriptFactory,
  )
  const displayStatus = getMotionDisplayStatus({
    motion,
    progress,
    isAttentionTime,
  })

  const requiresReport = MOTION_TYPES_REQUIRING_REPORT.has(motionType)
  const isReportFresh = ContractVaultHub.useSwrWeb3(
    'isReportFresh',
    [callDataDecoded || '0x0000000000000000000000000000000000000000'],
    { isPaused: () => !callDataDecoded },
  )

  const hasStaleReport =
    requiresReport &&
    !!callDataDecoded &&
    !isReportFresh.initialLoading &&
    isReportFresh.data === false

  if (pending) return <PageLoader />

  return (
    <Card>
      <Header>
        <div>
          <MotionNumber>Motion #{motion.id}</MotionNumber>
          <MotionTitle>
            {motionDisplaydName}
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
        {stonksRecipientAddress && (
          <Link
            passHref
            href={{
              pathname: stonksInstance(stonksRecipientAddress),
            }}
          >
            <StonksButton size="xs">Create Stonks Order</StonksButton>
          </Link>
        )}

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

      <MotionDetailedLimits />

      {!isArchived && (
        <MotionDetailedActions motion={motion} canEnact={!hasStaleReport} />
      )}
    </Card>
  )
}
