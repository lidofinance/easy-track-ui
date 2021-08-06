import styled from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;

  > *:not(:last-child) {
    margin-right: 10px;
  }
`

export const Hint = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-bottom: 10px;
  opacity: 0.8;
`
