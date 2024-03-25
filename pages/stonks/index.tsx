import { Button } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'
import { StonksPageContainer } from 'modules/stonks/ui/StonksPageContainer'
import { useStonksData } from 'modules/stonks/hooks/useStonksData'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MessageBox, Subtitle } from 'modules/stonks/ui/StonksOrderForm'
import { Title } from 'modules/shared/ui/Common/Title'
import { StonksOrderResolverForm } from 'modules/stonks/ui/StonksOrderResolverForm'
import { StonksGrid } from 'modules/stonks/ui/StonksGrid'

export default function StonksCreateOrderPage() {
  const { isWalletConnected } = useWeb3()
  const openConnectWalletModal = useConnectWalletModal()
  const { stonksData, isStonksDataLoading } = useStonksData()

  if (!isWalletConnected) {
    return (
      <StonksPageContainer>
        <Title title="Do stonks" />
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

  if (isStonksDataLoading) {
    return (
      <StonksPageContainer>
        <Title title="Do stonks" />
        <PageLoader />
      </StonksPageContainer>
    )
  }

  if (!stonksData) {
    return (
      <StonksPageContainer>
        <Title title="Do stonks" />
        <MessageBox>Only Stonks Managers have access to Stonks</MessageBox>
      </StonksPageContainer>
    )
  }

  return (
    <StonksPageContainer>
      <Title title="Do stonks" />
      <Subtitle size={20} weight={800} isCentered>
        Manage existing order
      </Subtitle>
      <StonksOrderResolverForm />
      {stonksData.length ? (
        <>
          <Subtitle size={20} weight={800} isCentered>
            Create on-chain order
          </Subtitle>
          <StonksGrid stonksData={stonksData} />
        </>
      ) : null}
    </StonksPageContainer>
  )
}
