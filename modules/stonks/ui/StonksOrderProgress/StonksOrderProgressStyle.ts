import { Text } from 'modules/shared/ui/Common/Text'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`

export const MessageBox = styled.div`
  width: 100%;
  display: flex;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md + 'px'};
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
