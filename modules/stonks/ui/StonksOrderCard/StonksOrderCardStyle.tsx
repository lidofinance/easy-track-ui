import { Container, Theme } from '@lidofinance/lido-ui'
import { BREAKPOINT_MOBILE } from 'modules/globalStyles'
import { Text } from 'modules/shared/ui/Common/Text'
import { OrderStatus } from 'modules/stonks/types'
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

export const OrderTitle = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const OrderUid = styled(Text).attrs({
  size: 14,
  weight: 800,
})`
  color: rgba(39, 56, 82, 0.6);
`

export const StatusLabel = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-bottom: 4px;
  opacity: 0.4;
`

type StatusValueProps = {
  value: OrderStatus
}

export const StatusValue = styled(Text).attrs({
  size: 14,
  weight: 800,
})`
  text-transform: uppercase;
  letter-spacing: 0.4px;

  ${({ value, theme }: StatusValueProps & { theme: Theme }) => {
    switch (value) {
      case 'fulfilled':
        return css`
          color: #53ba95;
        `
      case 'cancelled':
      case 'expired':
        return css`
          color: #de186b;
        `
      // rgb(0, 163, 255) - link
      default:
        return css`
          color: ${theme.colors.primary};
        `
    }
  }}
`

export const Row = styled(Text).attrs({
  size: 14,
  weight: 500,
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 32px;

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

export const MessageBox = styled.div`
  padding: 20px 15px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md + 'px'};
`

export const Link = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
`
