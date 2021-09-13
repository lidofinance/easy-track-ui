import styled from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'
import TrashSVG from 'assets/icons/trash.svg.react'

export const Fieldset = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;

  & > * {
    width: 100%;
  }
`

const RemoveItemButtonWrap = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  opacity: 0.6;
  margin-left: auto;
  margin-right: 0;
  cursor: pointer;
  transition: opacity ease ${({ theme }) => theme.duration.med};

  & svg {
    display: block;
    margin-left: 10px;
    fill: currentColor;
  }

  &:hover {
    opacity: 1;
    transition-duration: ${({ theme }) => theme.duration.fast};
  }
`

export function RemoveItemButton({
  onClick,
  children,
}: {
  onClick: React.MouseEventHandler
  children: React.ReactNode
}) {
  return (
    <RemoveItemButtonWrap onClick={onClick}>
      <div>{children}</div>
      <TrashSVG />
    </RemoveItemButtonWrap>
  )
}

export const MessageBox = styled.div`
  margin-bottom: 20px;
  padding: 20px 15px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md + 'px'};
`
