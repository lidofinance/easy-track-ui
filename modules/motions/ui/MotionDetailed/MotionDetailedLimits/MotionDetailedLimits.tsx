import { Divider } from '@lidofinance/lido-ui'

import { MotionWarningBox } from 'modules/shared/ui/Common/MotionWarningBox'
import { MotionLimitProgress } from 'modules/motions/ui/MotionLimitProgress'
import { useMotionDetailed } from 'modules/motions/hooks'

import { MotionDetailedLimitsWrapper } from './MotionDetailedLimitsStyle'

export function MotionDetailedLimits() {
  const {
    isArchived,
    periodLimitsData,
    motionTopUpAmount,
    motionTopUpToken,
    isOverPeriodLimit,
  } = useMotionDetailed()

  if (!periodLimitsData) return null

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
          newAmount={isArchived ? 0 : motionTopUpAmount}
        />
      </MotionDetailedLimitsWrapper>
      {isOverPeriodLimit && (
        <MotionWarningBox>
          Motion can not be enacted because monthly top-up limit was reached.
        </MotionWarningBox>
      )}
    </>
  )
}
