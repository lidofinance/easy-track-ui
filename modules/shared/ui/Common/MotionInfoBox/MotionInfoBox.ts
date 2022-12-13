import styled from 'styled-components'

export const MotionInfoBox = styled.div<{ $variant?: 'error' | 'warning' }>`
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  background-color: ${({ $variant }) =>
    $variant === 'error' ? 'rgba(225, 77, 77, 0.5)' : '#fffae0'};
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  font-size: 12px;
  line-height: 20px;
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
`
