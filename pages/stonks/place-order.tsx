import { Button } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'
import { StonksPageContainer } from 'modules/stonks/ui/StonksPageContainer'
import { useAvailableStonks } from 'modules/stonks/hooks/useAvailableStonks'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MessageBox, StonksOrderForm } from 'modules/stonks/ui/StonksOrderForm'

export default function StonksPlaceOrderPage() {
  const { isWalletConnected } = useWeb3()
  const openConnectWalletModal = useConnectWalletModal()
  const { areStonksAvailable, initialLoading } = useAvailableStonks()

  if (!isWalletConnected) {
    return (
      <StonksPageContainer>
        <MessageBox>Connect your wallet first</MessageBox>
        <br />
        <Button
          type="submit"
          fullwidth
          children="Connect wallet"
          onClick={openConnectWalletModal}
        />
      </StonksPageContainer>
    )
  }

  if (initialLoading) {
    return (
      <StonksPageContainer>
        <PageLoader />
      </StonksPageContainer>
    )
  }

  if (!areStonksAvailable) {
    return (
      <StonksPageContainer>
        <MessageBox>
          Only Stonks Managers have access to Stonks Orders
        </MessageBox>
      </StonksPageContainer>
    )
  }

  return (
    <StonksPageContainer>
      <StonksOrderForm />
    </StonksPageContainer>
  )
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
