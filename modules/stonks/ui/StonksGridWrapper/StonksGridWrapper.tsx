import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ConnectWalletButton } from 'modules/wallet/ui/ConnectWalletButton'
import { useStonksData } from 'modules/stonks/hooks/useStonksData'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MessageBox } from 'modules/stonks/ui/StonksOrderForm'
import { StonksGrid } from 'modules/stonks/ui/StonksGridWrapper/StonksGrid'

export function StonksGridWrapper() {
  const { isWalletConnected } = useWeb3()
  const { stonksData, isStonksDataLoading } = useStonksData()

  if (!isWalletConnected) {
    return (
      <ConnectWalletButton
        type="submit"
        fullwidth
        children="Connect wallet to proceed"
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
