import styled, { css } from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'
import { MotionDisplayStatus } from 'modules/motions/types'

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
  truncateLines: 5,
})`
  opacity: 0.6;
  margin-bottom: 16px;
`

export const CardProgress = styled(Text).attrs({
  size: 26,
  weight: 800,
})`
  margin-bottom: 16px;
  opacity: 0.4;
`

export const CardStatus = styled(Text).attrs({
  size: 10,
  weight: 800,
})`
  margin-bottom: 4px;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`

export const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 0;
`

export const FooterLabel = styled(Text).attrs({
  size: 10,
  weight: 800,
})`
  letter-spacing: 0.4px;
  text-transform: uppercase;
  opacity: 0.4;
`

export const FooterValue = styled(FooterLabel)`
  margin-top: 4px;
  opacity: 0.6;
`

const attendedStyle = css`
  box-shadow: inset 0px -20px 93px rgba(255, 214, 0, 0.44);

  & ${CardStatus}, & ${CardProgress}, & ${FooterValue} {
    opacity: 1;
  }
`

const dangerStyle = css`
  background: radial-gradient(
    76.72% 76.72% at 50% 67.59%,
    rgba(255, 201, 208, 0.6) 0%,
    rgba(255, 237, 237, 0.6) 68.99%,
    rgba(255, 255, 255, 0.6) 100%
  );

  &
    ${CardTitle},
    &
    ${CardDescription},
    &
    ${CardProgress},
    &
    ${CardStatus},
    &
    ${FooterValue} {
    color: #de186b;
  }

  & ${CardProgress}, & ${FooterValue} {
    opacity: 1;
  }
`

const statusStyles = {
  [MotionDisplayStatus.ACTIVE]: css`
    & ${CardStatus} {
      opacity: 1;
      color: ${({ theme }) => theme.colors.primary};
    }
  `,
  [MotionDisplayStatus.ATTENDED]: attendedStyle,
  [MotionDisplayStatus.DANGER]: dangerStyle,
  [MotionDisplayStatus.ATTENDED_DANGER]: css`
    ${dangerStyle};
    ${attendedStyle};
  `,
  [MotionDisplayStatus.ENACTED]: css`
    background: radial-gradient(
      76.72% 76.72% at 50% 67.59%,
      rgba(201, 255, 252, 0.6) 0%,
      rgba(237, 252, 255, 0.6) 68.99%,
      rgba(255, 255, 255, 0.6) 100%
    );

    & ${CardStatus}, & ${CardProgress} {
      color: #53ba95;
      opacity: 1;
    }
  `,
  [MotionDisplayStatus.DEFAULT]: css``,
} as const

type WrapProps = {
  displayStatus: MotionDisplayStatus
}
export const Wrap = styled.div<WrapProps>`
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;

  ${({ displayStatus }) => statusStyles[displayStatus]}
`
