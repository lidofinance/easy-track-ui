import styled from 'styled-components'

export const Actions = styled.div`
  display: flex;

  & > * {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    &:before {
      border-bottom: none;
      border-color: ${({ theme }) => theme.colors.border};
    }

    &:not(:first-child) {
      &:before {
        border-left: none;
      }
    }

    &:hover {
      &:before {
        border-color: ${({ theme }) => theme.colors.primary};
      }
    }
  }

  & > *:not(:last-child) {
    border-top-right-radius: 0;
    margin-right: -1px;
  }

  & > *:not(:first-child) {
    border-top-left-radius: 0;
  }
`

export const ScriptBox = styled.textarea.attrs({
  rows: 14,
  readOnly: true,
})`
  padding: 10px;
  display: block;
  resize: vertical;
  width: 100%;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono,
    Courier New, monospace !important;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0 8px 8px 8px;
  background-color: rgba(255, 255, 255, 0.2);
  outline: none;
`
