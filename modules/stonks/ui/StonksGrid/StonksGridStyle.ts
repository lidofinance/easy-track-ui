import { Text } from 'modules/shared/ui/Common/Text'
import styled from 'styled-components'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 8px;

  button {
    margin-top: 16px;
  }
`

export const CardTitle = styled(Text).attrs({
  size: 14,
  weight: 800,
})
