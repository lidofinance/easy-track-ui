import styled from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Col = styled.div``

export const ColValue = styled.div`
  margin-bottom: 10px;
`

export const ErrorMessageWrap = styled(Text).attrs({
  size: 14,
  weight: 500,
})`
  margin-top: 20px;
  padding: 20px;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.error};
  border-radius: 8px;
`
