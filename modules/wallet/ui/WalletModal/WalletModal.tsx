import { useCallback, useMemo } from 'react'
import { useEtherscanOpener } from 'modules/blockChain/hooks/useEtherscanOpener'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useWalletDisconnect } from 'modules/wallet/hooks/useWalletDisconnect'
import { useWalletConnectorStorage } from 'modules/wallet/hooks/useWalletConnectorStorage'
import { useCopyToClipboard } from 'modules/shared/hooks/useCopyToClipboard'
import { useGovernanceBalance } from 'modules/tokens/hooks/useGovernanceBalance'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { Text } from 'modules/shared/ui/Common/Text'
import {
  ButtonIcon,
  Modal,
  ModalProps,
  Identicon,
  External,
  Copy,
  trimAddress,
} from '@lidofinance/lido-ui'
import {
  Content,
  Connected,
  Connector,
  Disconnect,
  Account,
  Address,
  Actions,
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
  const handleCopy = useCopyToClipboard(address ?? '')
  const handleEtherscan = useEtherscanOpener(address ?? '', 'address')
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

        <Account>
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
        </Account>
        <Account>
          <Identicon address={address ?? ''} />
          <Address>{trimmedAddress}</Address>
        </Account>

        <Actions>
          <ButtonIcon
            onClick={handleCopy}
            icon={<Copy />}
            size="xs"
            variant="ghost"
            children="Copy address"
          />
          <ButtonIcon
            onClick={handleEtherscan}
            icon={<External />}
            size="xs"
            variant="ghost"
            children="View on Etherscan"
          />
        </Actions>
      </Content>
    </Modal>
  )
}
