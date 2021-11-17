import { Container } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'

export default function AboutPage() {
  return (
    <Container as="main" size="full">
      <Title title="About" />
    </Container>
  )
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
