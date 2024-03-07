import styled from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'

export const MessageBox = styled.div`
  margin-bottom: 20px;
  padding: 20px 15px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md + 'px'};
`

export const Block = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.foreground};
  border-radius: 8px;
`

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  & > * {
    width: 100%;
  }
`

export const RetryHint = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-top: 20px;
  text-align: center;
  opacity: 0.8;

  & button {
    display: inline-block;
    margin: 0;
    padding: 0;
    border: none;
    font-size: 12px;
    font-weight: 500;
    background: none;
    font-weight: 800;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const InfoRow = styled(Text).attrs({
  size: 14,
  weight: 500,
  color: 'textSecondary',
})`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column;
`

export const InfoValue = styled(Text).attrs({
  size: 14,
  weight: 500,
})``
