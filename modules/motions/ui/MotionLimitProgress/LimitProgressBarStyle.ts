import styled from 'styled-components'

type InjectedPropsTargetLine = {
  $negative?: boolean
}

export const ProgressBarLine = styled.div`
  margin: 8px 0;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm + 'px'};
  width: 100%;
  height: 20px;
  background: #eff2f6;
  position: relative;
`

export const SpentLine = styled.div`
  background-color: ${({ theme }) => theme.colors.success};
  height: 100%;
  width: 65%;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm + 'px'};
  overflow: hidden;
  position: relative;
`

export const TargetLine = styled.div<InjectedPropsTargetLine>`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm + 'px'};
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: hidden;
  background-color: ${({ $negative, theme }) =>
    $negative ? theme.colors.error : theme.colors.success};
  opacity: 0.5;
`
