import { Container } from '@lidofinance/lido-ui'

type Props = {
  children: React.ReactNode
}

export function StonksPageContainer(props: Props) {
  const { children } = props
  return (
    <Container as="main" size="tight">
      {children}
    </Container>
  )
}
