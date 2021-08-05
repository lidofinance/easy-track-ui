import styled from 'styled-components'
import { Text } from '../Text'

const TitleStyle = styled(Text)`
  margin-bottom: 30px;
  line-height: 1;
`

type Props = {
  children: React.ReactNode
}

export function Title({ children }: Props) {
  return <TitleStyle size={48} weight={800} children={children} />
}
