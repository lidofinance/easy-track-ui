import { Container } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { MotionFormStartNew } from 'modules/motions/ui/MotionFormStartNew'

export default function StartMotionPage() {
  return (
    <Container as="main" size="tight">
      <Title>Start Motion</Title>
      <MotionFormStartNew />
    </Container>
  )
}
