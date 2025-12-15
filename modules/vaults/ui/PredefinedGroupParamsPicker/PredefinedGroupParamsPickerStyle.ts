import styled from 'styled-components'

export const Wrap = styled.div`
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`

export const ButtonsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`
