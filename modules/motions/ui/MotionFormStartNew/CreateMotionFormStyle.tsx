import styled from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'
import TrashSVG from 'assets/icons/trash.svg.react'
import { Block } from 'modules/shared/ui/Common/Block'

export const Fieldset = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;

  & > * {
    width: 100%;
  }
`

export const FieldsWrapper = styled(Block)`
  margin-bottom: 20px;

  ${Fieldset}:last-of-type {
    margin-bottom: 0;
  }
`

export const FieldsHeader = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`

export const FieldsHeaderDesc = styled.span`
  font-size: 14px;
  font-weight: 700;
  line-height: 19px;
`

const RemoveItemButtonWrap = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  opacity: 0.6;
  margin-left: auto;
  margin-right: 0;
  cursor: pointer;
  transition: opacity ease ${({ theme }) => theme.duration.med};
  color: ${({ theme }) => theme.colors.error};
  font-weight: 700;

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

export const ErrorBox = styled.div`
  margin-bottom: 20px;
  padding: 20px 15px;
  font-size: 14px;
  background-color: rgba(255, 0, 0, 0.25);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md + 'px'};
`

export const RetryHint = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-top: 20px;
  text-align: center;
  opacity: 0.8;

  & button {
    display: inline-block;
    margin: 0;
    padding: 0;
    border: none;
    font-size: 12px;
    font-weight: 500;
    background: none;
    font-weight: 800;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primary};
  }
`
