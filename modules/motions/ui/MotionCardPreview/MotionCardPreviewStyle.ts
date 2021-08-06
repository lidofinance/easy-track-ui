import styled, { css } from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const CardTitle = styled(Text).attrs({
  size: 14,
  weight: 800,
})`
  margin-bottom: 8px;
`

export const CardDescription = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  opacity: 0.6;
  margin-bottom: 16px;
`

export const CardProgress = styled(Text).attrs({
  size: 26,
  weight: 800,
})`
  margin-bottom: 4px;
  color: rgba(39, 56, 82, 0.4);
`

export const CardStatus = styled(Text).attrs({
  size: 10,
  weight: 800,
})`
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`

export const CardTimeLabel = styled(Text).attrs({
  size: 10,
  weight: 800,
})`
  letter-spacing: 0.4px;
  text-transform: uppercase;
  opacity: 0.4;
`

export const CardTimeValue = styled(CardTimeLabel)`
  margin-top: 4px;
  opacity: 0.6;
`

type WrapProps = {
  isActive: boolean
  isSucceed: boolean
  isDangered: boolean
  isAttended: boolean
}
export const Wrap = styled.div<WrapProps>`
  padding: 24px;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;

  ${({ isActive, theme }) =>
    isActive &&
    css`
      & ${CardStatus} {
        color: ${theme.colors.primary};
      }
    `}

  ${({ isSucceed }) =>
    isSucceed &&
    css`
      background: radial-gradient(
        76.72% 76.72% at 50% 67.59%,
        rgba(201, 255, 252, 0.6) 0%,
        rgba(237, 252, 255, 0.6) 68.99%,
        rgba(255, 255, 255, 0.6) 100%
      );
    `}

  ${({ isDangered }) =>
    isDangered &&
    css`
      background: radial-gradient(
        76.72% 76.72% at 50% 67.59%,
        rgba(255, 201, 208, 0.6) 0%,
        rgba(255, 237, 237, 0.6) 68.99%,
        rgba(255, 255, 255, 0.6) 100%
      );

      & ${CardTitle}, & ${CardDescription}, & ${CardProgress}, & ${CardStatus} {
        color: #de186b;
      }
    `}

  ${({ isAttended }) =>
    isAttended &&
    css`
      box-shadow: inset 0px -20px 93px rgba(255, 214, 0, 0.44);
    `}
`
