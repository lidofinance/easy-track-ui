import { Header } from '../Header'
import { Container } from '@lidofinance/lido-ui'

type Props = {
  children: React.ReactNode
}

export function PageLayout({ children }: Props) {
  return (
    <>
      <Container as="header" size="full">
        <Header />
      </Container>
      <Container as="main" size="full">
        {children}
      </Container>
    </>
  )
}
