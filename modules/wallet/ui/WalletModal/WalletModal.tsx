import { useCallback, useMemo } from 'react'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useConnectorStorage, useDisconnect } from '@lido-sdk/web3-react'
import { useGovernanceBalance } from 'modules/tokens/hooks/useGovernanceBalance'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

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

function WalletModalContent() {
  const { walletAddress: address } = useWalletInfo()
  const trimmedAddress = useMemo(() => trimAddress(address ?? '', 6), [address])
  const governanceBalance = useGovernanceBalance()
  const { data: governanceSymbol } = useGovernanceSymbol()

  return (
    <>
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
    </>
  )
}

export function WalletModal(props: ModalProps) {
  const { onClose } = props
  const [connector] = useConnectorStorage()
  const { disconnect } = useDisconnect()
  const chainId = useCurrentChain()
  const { supportedChainIds } = useConfig()
  const isChainSupported = useMemo(
    () => supportedChainIds.includes(chainId),
    [chainId, supportedChainIds],
  )

  const handleDisconnect = useCallback(() => {
    disconnect?.()
    onClose?.()
  }, [disconnect, onClose])

  return (
    <Modal title="Account" {...props}>
      <Content>
        <Connected>
          <Connector>Connected with {connector}</Connector>
          <Disconnect size="xs" variant="outlined" onClick={handleDisconnect}>
            Disconnect
          </Disconnect>
        </Connected>
        {isChainSupported && <WalletModalContent />}
      </Content>
    </Modal>
  )
}
