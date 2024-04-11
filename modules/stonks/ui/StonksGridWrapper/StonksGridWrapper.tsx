import { Button } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'
import { useStonksData } from 'modules/stonks/hooks/useStonksData'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MessageBox } from 'modules/stonks/ui/StonksOrderForm'
import { StonksGrid } from 'modules/stonks/ui/StonksGridWrapper/StonksGrid'

export function StonksGridWrapper() {
  const { isWalletConnected } = useWeb3()
  const openConnectWalletModal = useConnectWalletModal()
  const { stonksData, isStonksDataLoading } = useStonksData()

  if (!isWalletConnected) {
    return (
      <Button
        type="submit"
        fullwidth
        children="Connect wallet to proceed"
        onClick={openConnectWalletModal}
      />
    )
  }

  if (isStonksDataLoading) {
    return <PageLoader />
  }

  if (!stonksData) {
    return (
      <MessageBox>Only Stonks Managers can create Stonks Orders</MessageBox>
    )
  }

  return <StonksGrid stonksData={stonksData} />
}
