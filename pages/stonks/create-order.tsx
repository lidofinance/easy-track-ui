import { Button } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'
import { StonksPageContainer } from 'modules/stonks/ui/StonksPageContainer'
import { useAvailableStonks } from 'modules/stonks/hooks/useAvailableStonks'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MessageBox, StonksOrderForm } from 'modules/stonks/ui/StonksOrderForm'
import { useRouter } from 'next/router'
import { utils } from 'ethers'
import { useMemo } from 'react'

export default function StonksCreateOrderPage() {
  const { isWalletConnected } = useWeb3()
  const openConnectWalletModal = useConnectWalletModal()
  const router = useRouter()
  const { areStonksAvailable, availableStonks, initialLoading } =
    useAvailableStonks()

  const addressParam = useMemo(() => {
    const queryAddress = String(router.query.address)
    if (!utils.isAddress(queryAddress) || !availableStonks?.length) {
      return null
    }

    return (
      availableStonks.find(
        stonks => stonks.address === utils.getAddress(queryAddress),
      )?.address ?? null
    )
  }, [availableStonks, router.query.address])

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
      <StonksOrderForm addressParam={addressParam} />
    </StonksPageContainer>
  )
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
