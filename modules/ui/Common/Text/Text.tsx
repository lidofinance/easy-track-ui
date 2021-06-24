import styled, { css } from 'styled-components'

type Props = {
  size: 12 | 14 | 16 | 18 | 20 | 48
  weight: 400 | 500 | 700
  truncateLines?: number
}

export const Text = styled.div<Props>`
  font-size: ${({ size }) => size}px;
  font-weight: ${({ weight }) => weight};

  ${({ truncateLines }) =>
    truncateLines === undefined
      ? undefined
      : truncateLines === 1
      ? css`
          max-width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        `
      : css`
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: ${truncateLines};
        `}
`
