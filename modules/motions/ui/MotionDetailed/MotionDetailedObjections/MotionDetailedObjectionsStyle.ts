import styled, { css } from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'

export const ObjectionsTitle = styled(Text).attrs({
  size: 14,
  weight: 800,
  color: 'inherit',
})`
  margin-bottom: 28px;
`

export const ObjectionsPercents = styled(Text).attrs({
  size: 94,
  weight: 800,
  color: 'inherit',
})`
  margin-bottom: 28px;
  line-height: 1;
  font-size: 94px;
  letter-spacing: -2%;
`

export const ObjectionsValue = styled(Text).attrs({
  size: 14,
  weight: 800,
  color: 'inherit',
})``

export const ObjectionsThreshold = styled.span`
  opacity: 0.4;
`

type ObjectionsInfoProps = {
  isRejected: boolean
}
export const ObjectionsInfo = styled.div<ObjectionsInfoProps>`
  ${({ isRejected }) =>
    isRejected &&
    css`
      color: #de186b;
    `}
`
