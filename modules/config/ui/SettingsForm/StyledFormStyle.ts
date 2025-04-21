import { Block } from '@lidofinance/lido-ui'
import styled from 'styled-components'

export const Actions = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`

export const DescriptionText = styled.div`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 500;
  line-height: 1.5;

  & p:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  }

  & a {
    text-decoration: none;
    color: var(--lido-color-primary);
  }
`

export const DescriptionTitle = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  font-weight: 800;
  line-height: 1.5;
  color: var(--lido-color-text);

  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.spaceMap.md}px;
  }
`

export const Fieldset = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;

  & > * {
    width: 100%;
  }
`

export const Card = styled(Block).attrs({
  paddingLess: true,
})`
  box-shadow: ${({ theme }) => theme.boxShadows.xl}
    var(--lido-color-shadowLight);
  padding: 20px;
`
