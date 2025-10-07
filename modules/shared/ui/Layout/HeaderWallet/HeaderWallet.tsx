import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { Button } from '@lidofinance/lido-ui'

import { useWalletModal } from 'modules/wallet/ui/WalletModal'
import { useConnect } from 'reef-knot/core-react'
import { Wrap, AddressBadge } from './HeaderWalletStyle'

export function HeaderWallet() {
  const { isWalletConnected, walletAddress } = useWeb3()
  const openWalletModal = useWalletModal()
  const { connect } = useConnect()

  if (!isWalletConnected) {
    return (
      <Wrap>
        <Button
          size="sm"
          onClick={connect}
          children="Connect"
          style={{ width: '100%' }}
        />
      </Wrap>
    )
  }

  return (
    <Wrap>
      <AddressBadge
        symbols={3}
        address={walletAddress!}
        onClick={openWalletModal}
      />
    </Wrap>
  )
}
