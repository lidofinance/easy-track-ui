import { Divider } from '@lidofinance/lido-ui'

import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { MotionLimitProgress } from 'modules/motions/ui/MotionLimitProgress'
import { useMotionDetailed } from 'modules/motions/providers/hooks/useMotionDetaled'

import { MotionDetailedLimitsWrapper } from './MotionDetailedLimitsStyle'

export function MotionDetailedLimits() {
  const {
    isArchived,
    periodLimitsData,
    motionTopUpAmount,
    motionTopUpToken,
    isOverPeriodLimit,
    isCanEnactInNextPeriod,
  } = useMotionDetailed()

  if (!periodLimitsData || isArchived) return null

  return (
    <>
      <Divider indents="md" />
      <MotionDetailedLimitsWrapper>
        <MotionLimitProgress
          spentAmount={periodLimitsData.periodData.alreadySpentAmount}
          totalLimit={periodLimitsData.limits.limit}
          startDate={periodLimitsData.periodData.periodStartTimestamp}
          endDate={periodLimitsData.periodData.periodEndTimestamp}
          token={motionTopUpToken}
          newAmount={motionTopUpAmount}
        />
      </MotionDetailedLimitsWrapper>
      {isOverPeriodLimit && !isCanEnactInNextPeriod && (
        <MotionInfoBox $variant="error">
          Motion can’t be enacted as the transfer value is greater than the
          period limit.
        </MotionInfoBox>
      )}
      {isCanEnactInNextPeriod && isOverPeriodLimit && (
        <MotionInfoBox>
          Motion can’t be enacted before the period limits are replenished.
        </MotionInfoBox>
      )}
    </>
  )
}
