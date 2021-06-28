import styled, { css, keyframes } from 'styled-components'

export const Wrap = styled.div`
  position: relative;
  cursor: pointer;
`

const popIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

type PopProps = { isVisible: boolean }
export const Pop = styled.div<PopProps>`
  cursor: default;
  padding: 10px;
  position: fixed;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.foreground};
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2);

  ${({ isVisible }) =>
    isVisible
      ? css`
          animation: ${popIn} ${({ theme }) => theme.duration.norm} 1;
          animation-timing-function: ${({ theme }) => theme.ease.outBack};
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`

export const Actions = styled.div`
  display: flex;
  margin-top: 10px;
`