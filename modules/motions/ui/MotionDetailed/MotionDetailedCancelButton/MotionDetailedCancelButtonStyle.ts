import styled, { css } from 'styled-components'

type CancelButtonProps = {
  isActive: boolean
}
export const CancelButton = styled.div<CancelButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(39, 56, 82, 0.1);
  border-radius: 6px;

  ${({ isActive = true }) =>
    isActive &&
    css`
      cursor: pointer;
    `}
`

export const Wrap = styled.div`
  margin-left: 64px;
`
