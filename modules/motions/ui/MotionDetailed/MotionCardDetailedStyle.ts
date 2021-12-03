import styled, { css } from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'
import type { Theme } from '@lidofinance/lido-ui'
import { BREAKPOINT_MOBILE } from 'modules/globalStyles'

export const Card = styled.div`
  padding: 50px 60px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.5);

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    margin: 0 20px;
    padding: 20px;
  }
`

export const Header = styled.div`
  margin-bottom: 64px;
  display: flex;
  justify-content: space-between;
`

export const HeaderAside = styled.div`
  display: flex;
  align-items: center;
`

export const HeaderStatus = styled.div``

export const MotionNumber = styled(Text).attrs({
  size: 14,
  weight: 800,
})`
  margin-bottom: 3px;
  color: rgba(39, 56, 82, 0.6);
`

export const MotionTitle = styled(Text).attrs({
  size: 14,
  weight: 800,
})``

export const StatusLabel = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-bottom: 3px;
  opacity: 0.4;
`

type StatusValueProps = {
  isActive: boolean
  isRejected: boolean
}
export const StatusValue = styled(Text).attrs({
  size: 14,
  weight: 800,
})`
  text-transform: uppercase;
  letter-spacing: 0.4px;

  ${({ isActive, theme }: StatusValueProps & { theme: Theme }) =>
    isActive &&
    css`
      color: ${theme.colors.primary};
    `}

  ${({ isRejected }: StatusValueProps) =>
    isRejected &&
    css`
      color: #de186b;
    `}
`

export const Description = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-bottom: 64px;
  color: rgba(39, 56, 82, 0.6);
  word-break: break-all;
`

export const InfoRow = styled.div`
  margin-bottom: 64px;
  display: flex;
  justify-content: space-between;
`

export const InfoCol = styled.div`
  &:nth-child(1) {
    flex: 1 1 auto;
  }

  &:nth-child(2) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 20px;
    flex: 0 0 auto;
    border-left: 1px solid rgba(39, 56, 82, 0.1);
  }
`

export const InfoCell = styled.div`
  &:not(:last-child) {
    margin-bottom: 26px;
  }
`

export const InfoLabel = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  opacity: 0.4;
  margin-bottom: 4px;
`

export const StartDateCell = styled.div`
  margin-top: 30px;
`

export const StartDateValue = styled.div`
  font-weight: 800;
  font-size: 14px;
  line-height: 22px;
  text-transform: uppercase;
  color: rgba(39, 56, 82, 0.6);
`

export const StartDateTime = styled.span`
  color: rgba(39, 56, 82, 0.4);
`
