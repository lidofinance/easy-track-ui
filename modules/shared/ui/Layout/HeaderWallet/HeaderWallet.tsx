import { useModal } from 'modules/modal/useModal'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'

import { Button } from '@lidofinance/lido-ui'

import { WalletModal } from 'modules/wallet/ui/WalletModal'
import { ConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'
import { Wrap, AddressBadge } from './HeaderWalletStyle'

export function HeaderWallet() {
  const { isWalletConnected, walletAddress } = useWalletInfo()
  const openWalletModal = useModal(WalletModal)
  const openConnectWalletModal = useModal(ConnectWalletModal)

  if (!isWalletConnected) {
    return (
      <Wrap>
        <Button
          size="sm"
          onClick={openConnectWalletModal}
          children="Connect"
          style={{ width: '100%' }}
        />
      </Wrap>
    )
  }

  return (
    <Wrap>
      <AddressBadge
        symbols={5}
        address={walletAddress!}
        onClick={openWalletModal}
      />
    </Wrap>
  )
}
