import { Button } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'
import { StonksPageContainer } from 'modules/stonks/ui/StonksPageContainer'
import { useAvailableStonks } from 'modules/stonks/hooks/useAvailableStonks'
import { useStonksData } from 'modules/stonks/hooks/useStonksData'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MessageBox, StonksOrderForm } from 'modules/stonks/ui/StonksOrderForm'
import { Title } from 'modules/shared/ui/Common/Title'
import { formatValue } from 'modules/stonks/utils/formatValue'
import { useRouter } from 'next/dist/client/router'
import * as urls from 'modules/network/utils/urls'

export default function StonksCreateOrderPage() {
  const { isWalletConnected } = useWeb3()
  const router = useRouter()
  const openConnectWalletModal = useConnectWalletModal()
  useAvailableStonks()
  const { data: stonksList, initialLoading: isStonksDataLoading } =
    useStonksData()

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

  if (isStonksDataLoading) {
    return (
      <StonksPageContainer>
        <PageLoader />
      </StonksPageContainer>
    )
  }

  if (!stonksList) {
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
      <Title title={'Available stonks'} />
      {stonksList.map(stonks => (
        <Button
          key={stonks.address}
          color="secondary"
          fullwidth
          size="sm"
          onClick={() => router.push(urls.stonksInstance(stonks.address))}
        >
          {stonks.tokenFrom.label} {'->'}
          {stonks.tokenTo.label} ({formatValue(stonks.currentBalance)}{' '}
          {stonks.tokenFrom.label})
        </Button>
      ))}

      <StonksOrderForm />
    </StonksPageContainer>
  )
}
