import { LimitProgressBar } from './LimitProgressBar'
import {
  MotionLimitProgressWrapper,
  ProgressHeader,
  ProgressDesc,
  Limit,
  LimitDesc,
  ProgressPeriodWrapper,
} from './MotionLimitProgressStyle'

export function MotionLimitProgress() {
  return (
    <MotionLimitProgressWrapper>
      <ProgressHeader>
        <ProgressDesc>Motion bank limit</ProgressDesc>
        <LimitDesc>
          <span>12,550</span> <Limit>/ 20,000 LDO</Limit>
        </LimitDesc>
      </ProgressHeader>
      <LimitProgressBar />
      <ProgressPeriodWrapper>
        <span>1 August 2022</span>
        <span>31 August 2022</span>
      </ProgressPeriodWrapper>
    </MotionLimitProgressWrapper>
  )
}
