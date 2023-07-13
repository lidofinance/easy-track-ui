import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  color: var(--lido-color-textDark);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  background: radial-gradient(
    76.72% 76.72% at 50% 67.59%,
    rgba(255, 201, 208, 0.6) 0%,
    rgba(255, 237, 237, 0.6) 68.99%,
    rgba(255, 255, 255, 0.6) 100%
  );
  box-shadow: inset 0px -20px 93px rgba(255, 214, 0, 0.44);

  & svg {
    display: block;
    flex: 0 0 auto;
    margin-right: ${({ theme }) => theme.spaceMap.sm}px;
    fill: var(--lido-color-textDark);
  }
`
