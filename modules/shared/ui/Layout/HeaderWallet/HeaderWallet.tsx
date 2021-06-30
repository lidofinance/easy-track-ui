import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'

import { Button } from '@lidofinance/lido-ui'

import { useWalletModal } from 'modules/wallet/ui/WalletModal'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'
import { Wrap, AddressBadge } from './HeaderWalletStyle'

export function HeaderWallet() {
  const { isWalletConnected, walletAddress } = useWalletInfo()
  const openWalletModal = useWalletModal()
  const openConnectWalletModal = useConnectWalletModal()

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
