import { Text } from 'modules/shared/ui/Common/Text'
import { Bar, Progress, Row, Col } from './MotionObjectionsBarStyle'

import type { Motion } from 'modules/motions/types'
import { useMotionProgress } from 'modules/motions/hooks/useMotionProgress'

type Props = {
  motion: Motion
}

export function MotionObjectionsBar({ motion }: Props) {
  const progress = useMotionProgress(motion)

  if (!progress) return <>Loading..</>

  const { objectionsPct, objectionsAmount, thresholdAmount, thresholdPct } =
    progress

  return (
    <>
      <Bar>
        <Progress style={{ width: `${objectionsPct}%` }} />
      </Bar>
      <Row>
        <Col>
          <Text size={14} weight={500}>
            {objectionsPct}% / {objectionsAmount} LDO
          </Text>
        </Col>
        <Col>
          <Text size={14} weight={500}>
            {thresholdAmount} LDO / {thresholdPct}%
          </Text>
        </Col>
      </Row>
    </>
  )
}
