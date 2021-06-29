import styled from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'

export const Layout = styled.div`
  display: flex;
  width: 100%;
`

export const Column = styled.div`
  flex: 0 0 250px;
  margin-left: 20px;

  > *:not(:last-child) {
    margin-bottom: 20px;
  }
`

export const MainBody = styled.div`
  flex: 1 1 auto;
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;

  > *:not(:last-child) {
    margin-right: 10px;
  }
`

export const InfoTitle = styled(Text).attrs({
  size: 14,
  weight: 500,
})`
  margin-bottom: 10px;
  text-transform: uppercase;
`

export const InfoText = styled(Text).attrs({
  size: 16,
  weight: 400,
})`
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`
