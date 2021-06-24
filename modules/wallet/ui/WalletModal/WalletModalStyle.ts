import { Button } from '@lidofinance/lido-ui'
import styled from 'styled-components'

export const Content = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
`

export const Connected = styled.div`
  display: flex;
  align-items: center;
`

export const Connector = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 1.4em;
  flex-grow: 1;
  padding-right: ${({ theme }) => theme.spaceMap.md}px;
  margin: ${({ theme }) => theme.spaceMap.sm}px 0;
  margin-right: auto;
`

export const Disconnect = styled(Button)`
  flex-shrink: 0;
`

export const Account = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spaceMap.sm}px 0;
`

export const Address = styled.div`
  margin-left: ${({ theme }) => theme.spaceMap.sm}px;
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: 1.2em;
  font-weight: 600;
`

export const Actions = styled.div`
  margin: 0 ${({ theme }) => -theme.spaceMap.sm}px;
  margin-top: ${({ theme }) => theme.spaceMap.md}px;

  button {
    padding-left: ${({ theme }) => theme.spaceMap.sm}px;
    padding-right: ${({ theme }) => theme.spaceMap.sm}px;
    margin-right: ${({ theme }) => theme.spaceMap.sm}px;
  }
`
