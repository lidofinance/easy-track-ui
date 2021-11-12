import { useCallback, useMemo } from 'react'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useWalletDisconnect } from 'modules/wallet/hooks/useWalletDisconnect'
import { useWalletConnectorStorage } from 'modules/wallet/hooks/useWalletConnectorStorage'
import { useGovernanceBalance } from 'modules/tokens/hooks/useGovernanceBalance'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { Text } from 'modules/shared/ui/Common/Text'
import { CopyOpenActions } from 'modules/shared/ui/Common/CopyOpenActions'
import { Modal, ModalProps, Identicon, trimAddress } from '@lidofinance/lido-ui'
import {
  Content,
  Connected,
  Connector,
  Disconnect,
  Row,
  Address,
} from './WalletModalStyle'

import { formatToken } from 'modules/tokens/utils/formatToken'

export function WalletModal(props: ModalProps) {
  const { onClose } = props
  const { walletAddress: address } = useWalletInfo()
  const [connector] = useWalletConnectorStorage()
  const disconnect = useWalletDisconnect()

  const handleDisconnect = useCallback(() => {
    disconnect()
    onClose?.()
  }, [disconnect, onClose])

  const trimmedAddress = useMemo(() => trimAddress(address ?? '', 6), [address])
  const governanceBalance = useGovernanceBalance()
  const { data: governanceSymbol } = useGovernanceSymbol()

  return (
    <Modal title="Account" {...props}>
      <Content>
        <Connected>
          <Connector>Connected with {connector}</Connector>
          <Disconnect size="xs" variant="outlined" onClick={handleDisconnect}>
            Disconnect
          </Disconnect>
        </Connected>

        <Row>
          <Text
            size={12}
            weight={500}
            children={`${governanceSymbol} Balance:`}
          />
          <Text size={12} weight={500}>
            &nbsp;
            {governanceBalance.initialLoading || !governanceBalance.data
              ? 'Loading...'
              : formatToken(governanceBalance.data, governanceSymbol || '')}
          </Text>
        </Row>

        <Row>
          <Identicon address={address ?? ''} />
          <Address>{trimmedAddress}</Address>
        </Row>

        <Row>
          <CopyOpenActions value={address} entity="address" />
        </Row>
      </Content>
    </Modal>
  )
}
