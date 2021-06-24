import { useCallback, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useEtherscanOpen } from 'modules/blockChain/hooks/useEtherscanOpen'
import { useDisconnectWallet } from 'modules/wallet/hooks/useDisconnectWallet'
import { useConnectorStorage } from 'modules/wallet/hooks/useConnectorStorage'
import { useCopyToClipboard } from 'modules/hooks/useCopyToClipboard'
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

export function WalletModal(props: ModalProps) {
  const { onClose } = props
  const { account } = useWeb3React()
  const [connector] = useConnectorStorage()
  const disconnect = useDisconnectWallet()

  const handleDisconnect = useCallback(() => {
    disconnect()
    onClose?.()
  }, [disconnect, onClose])

  const trimmedAddress = useMemo(() => trimAddress(account ?? '', 6), [account])

  const handleCopy = useCopyToClipboard(account ?? '')
  const handleEtherscan = useEtherscanOpen(account ?? '', 'address')

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
          <Identicon address={account ?? ''} />
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
