import { useWeb3React } from '@web3-react/core'
import { useModal } from 'modules/modal/useModal'

import { Button } from '@lidofinance/lido-ui'

import { WalletModal } from 'modules/wallet/ui/WalletModal'
import { ConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'
import { Wrap, AddressBadge } from './HeaderWalletStyle'

export function HeaderWallet() {
  const web3 = useWeb3React()
  const openWalletModal = useModal(WalletModal)
  const openConnectWalletModal = useModal(ConnectWalletModal)

  if (!web3.active) {
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
        address={web3.account!}
        onClick={openWalletModal}
      />
    </Wrap>
  )
}
