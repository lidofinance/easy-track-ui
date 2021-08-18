import styled, { css } from 'styled-components'
import { MotionDisplayStatus } from 'modules/motions/types'

const warnStyles = css`
  color: #de186b;
`

const succeedStyles = css`
  color: #53ba95;
`

const statusStyles = {
  [MotionDisplayStatus.ACTIVE]: undefined,
  [MotionDisplayStatus.ATTENDED]: undefined,
  [MotionDisplayStatus.DANGER]: warnStyles,
  [MotionDisplayStatus.ATTENDED_DANGER]: warnStyles,
  [MotionDisplayStatus.ENACTED]: succeedStyles,
  [MotionDisplayStatus.DEFAULT]: undefined,
} as const

type WrapProps = {
  displayStatus: MotionDisplayStatus
}
export const Wrap = styled.div<WrapProps>`
  ${({ displayStatus }) => statusStyles[displayStatus]}
`

export const Title = styled.div`
  margin-bottom: 4px;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
`

export const Value = styled.div`
  font-weight: 800;
  font-size: 36px;
  line-height: 44px;
  text-transform: uppercase;
`

export const Subvalue = styled(Value)`
  opacity: 0.6;
`
