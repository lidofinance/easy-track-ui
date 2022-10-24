import { ProgressBarLine, SpentLine, TargetLine } from './LimitProgressBarStyle'

export function LimitProgressBar() {
  return (
    <ProgressBarLine>
      <TargetLine $negative={true} />
      <SpentLine />
    </ProgressBarLine>
  )
}
