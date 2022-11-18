import styled from 'styled-components'

export const MotionWarningBox = styled.div`
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  background-color: #fffae0;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  font-size: 12px;
  line-height: 20px;
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
`
