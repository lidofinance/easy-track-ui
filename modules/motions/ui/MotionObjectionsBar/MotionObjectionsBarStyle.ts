import styled from 'styled-components'

export const Bar = styled.div`
  margin-bottom: 4px;
  position: relative;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.backgroundDarken};
  overflow: hidden;
`

export const Progress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Col = styled.div``
