import styled from 'styled-components'

export const Wrap = styled.div`
  display: grid;
  grid-gap: 1px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  justify-content: space-between;
  border-radius: 20px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.2);
`
