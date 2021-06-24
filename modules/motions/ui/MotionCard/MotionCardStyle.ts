import styled from 'styled-components'
import { Text } from 'modules/ui/Common/Text'

export const Wrap = styled.div`
  padding: 20px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.foreground};
`

export const FieldWrap = styled.div`
  display: flex;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`

export const FieldLabel = styled(Text)`
  flex: 0 0 auto;
  margin-right: 6px;
`

export const FieldText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${({ theme }) => theme.colors.foreground};

  &:hover {
    z-index: 1;
    overflow: visible;
    text-overflow: ellipsis;
    padding-right: 10px;
    border-radius: 6px;
    box-shadow: 6px 0 6px 0 rgba(0, 0, 0, 0.1);
  }
`
