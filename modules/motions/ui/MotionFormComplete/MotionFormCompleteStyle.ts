import styled from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'
import { Loader } from '@lidofinance/lido-ui'
import { TxStatus } from 'modules/blockChain/types'

export const Hash = styled(Text).attrs({
  size: 10,
  weight: 500,
})`
  padding: 10px 15px;
  margin-top: 5px;
  margin-bottom: 15px;
  border-radius: 20px;
  width: fit-content;
  word-break: break-all;
  /* background-color: rgba(39, 56, 82, 0.1); */
  background-color: rgba(0, 163, 255, 0.1);
`

export const StatusWrap = styled(Text).attrs({
  size: 14,
  weight: 500,
})`
  height: 20px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px;
`

type StatusProps = {
  status: TxStatus
}
export const Status = styled.span<StatusProps>`
  margin-left: 4px;
  font-weight: 800;
  cursor: pointer;
  color: ${({ status, theme }) =>
    status === 'pending'
      ? theme.colors.primary
      : status === 'success'
      ? theme.colors.success
      : theme.colors.error};
`

export const StatusLoader = styled(Loader).attrs({ size: 'small' })`
  position: relative;
  top: 1px;
  margin-left: 7px;
`
