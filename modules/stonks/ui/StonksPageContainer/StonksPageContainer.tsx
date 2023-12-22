import { Container } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'

type Props = {
  children: React.ReactNode
  title?: React.ReactNode
  subtitle?: React.ReactNode
}

export function StonksPageContainer(props: Props) {
  const { children, title, subtitle } = props
  return (
    <Container as="main" size="tight">
      <Title title={title ?? 'Create Stonks Order'} subtitle={subtitle} />
      {children}
    </Container>
  )
}
