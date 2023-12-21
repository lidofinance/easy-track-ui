import { Container, Theme } from '@lidofinance/lido-ui'
import { BREAKPOINT_MOBILE } from 'modules/globalStyles'
import { Text } from 'modules/shared/ui/Common/Text'
import styled, { css } from 'styled-components'

export const ContentContainer = styled(Container).attrs({
  as: 'main',
})`
  margin: 0 auto;
  max-width: 600px;
`

export const ErrorMessageBox = styled(Text).attrs({
  size: 14,
  weight: 500,
})`
  padding: 20px;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.error};
  border-radius: 8px;
`

export const Card = styled.div`
  padding: 32px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    margin: 0 20px;
    padding: 20px;
  }
`

export const OrderTitle = styled(Text).attrs({
  size: 16,
  weight: 800,
})`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const StatusLabel = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-bottom: 4px;
  opacity: 0.4;
`

type StatusValueProps = {
  isActive: boolean
  isCancelled: boolean
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

  ${({ isCancelled }: StatusValueProps) =>
    isCancelled &&
    css`
      color: #de186b;
    `}
`

export const Row = styled(Text).attrs({
  size: 14,
  weight: 500,
})`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > div {
    display: flex;
    align-items: center;
    gap: 4px;

    &:last-child {
      font-weight: 600;
    }
  }
`

export const ButtonsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;

  & > * {
    flex: 1;
  }
`

export const ButtonWrap = styled.div`
  margin-top: 20px;
`
