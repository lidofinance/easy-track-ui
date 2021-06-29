import type { Theme } from '@lidofinance/lido-ui'
import styled, { css } from 'styled-components'

export type TextSize = 12 | 14 | 16 | 18 | 20 | 48
export type TextWeight = 400 | 500 | 700
export type TextColor = keyof Theme['colors']

type Props = {
  size: TextSize
  weight: TextWeight
  color?: TextColor
  truncateLines?: number
}

export const Text = styled.div<Props>`
  font-size: ${({ size }) => size}px;
  font-weight: ${({ weight }) => weight};
  color: ${({ color = 'text', theme }) => theme.colors[color]};

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
