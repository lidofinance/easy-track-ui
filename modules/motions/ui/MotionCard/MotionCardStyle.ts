import styled, { css } from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'

export const Wrap = styled.div`
  padding: 20px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.foreground};
  cursor: pointer;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`

export const FieldWrap = styled.div`
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`

export const FieldLabel = styled(Text)`
  flex: 0 0 auto;
  margin-right: 6px;
`

type FieldTextProps = { isHoverable?: boolean }
export const FieldText = styled.div<FieldTextProps>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${({ theme }) => theme.colors.foreground};

  ${({ isHoverable }) =>
    isHoverable &&
    css`
      &:hover {
        z-index: 1;
        overflow: visible;
        text-overflow: ellipsis;
        padding-right: 10px;
        border-radius: 6px;
        box-shadow: 6px 0 6px 0 rgba(0, 0, 0, 0.1);
      }
    `}
`
