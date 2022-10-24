import styled from 'styled-components'

export const WarningBox = styled.div`
  margin: 0 auto;
  padding: 20px;
  max-width: 400px;
  text-align: center;
  color: ${({ theme }) => theme.colors.warningContrast};
  background-color: ${({ theme }) => theme.colors.warningHover};
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
`
