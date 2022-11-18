import { ProgressBarLine, SpentLine, TargetLine } from './LimitProgressBarStyle'

type LimitProgressBarProps = {
  progress: number
  newProgress: number
  negative: boolean
}

export function LimitProgressBar(props: LimitProgressBarProps) {
  const { progress, negative, newProgress } = props

  return (
    <ProgressBarLine>
      <TargetLine $negative={negative} $width={newProgress} />
      <SpentLine $width={progress} $newWidth={newProgress} />
    </ProgressBarLine>
  )
}
