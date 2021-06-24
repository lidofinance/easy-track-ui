import styled from 'styled-components'
import { Text } from '../Text'

const TitleStyle = styled(Text)`
  margin-bottom: 20px;
`

type Props = {
  children: React.ReactNode
}

export function Title({ children }: Props) {
  return (
    <TitleStyle size={48} weight={400}>
      {children}
    </TitleStyle>
  )
}
