import styled from 'styled-components'

export const Actions = styled.div`
  display: flex;
  margin-bottom: 10px;

  & > *:not(:last-child) {
    margin-right: 10px;
  }
`

export const ScriptBox = styled.textarea.attrs({
  rows: 14,
  readOnly: true,
})`
  display: block;
  resize: vertical;
  width: 100%;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono,
    Courier New, monospace !important;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  outline: none;
`
