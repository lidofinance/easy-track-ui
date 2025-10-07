import styled from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'
import { TxStatus as TxStatusType } from 'modules/blockChain/types'
import { ConnectWalletButton } from 'modules/wallet/ui/ConnectWalletButton'
import { Button } from '@lidofinance/lido-ui'

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;

  > *:not(:last-child) {
    margin-right: 10px;
  }
`

export const Hint = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-bottom: 10px;
  opacity: 0.8;
`

export const TxHint = styled(Hint)`
  display: flex;
  align-items: flex-end;
`

type TxStatusProps = {
  status: TxStatusType
}
export const TxStatus = styled.span<TxStatusProps>`
  margin-left: 4px;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  color: ${({ status, theme }) =>
    status === 'pending'
      ? theme.colors.primary
      : status === 'success'
      ? theme.colors.success
      : theme.colors.error};
`

export const ButtonStyled = styled(Button)`
  flex-grow: 1;
  flex-basis: 40%;
`

export const ConnectWalletButtonStyled = styled(ConnectWalletButton)`
  flex-grow: 1;
  flex-basis: 40%;
`
