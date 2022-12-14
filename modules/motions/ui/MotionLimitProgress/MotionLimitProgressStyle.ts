import styled from 'styled-components'
import { Block } from 'modules/shared/ui/Common/Block'

export const MotionLimitProgressWrapper = styled(Block)`
  margin: 20px 0;
`

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

export const ProgressDesc = styled.span`
  font-size: 14px;
  font-weight: 700;
`

export const LimitDesc = styled.div`
  font-size: 14px;
`

export const Limit = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const ProgressPeriodWrapper = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`
