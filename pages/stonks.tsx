import { Button } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'
import { useState } from 'react'
import { ResultTx } from 'modules/blockChain/types'
import { StonksOrderForm, MessageBox } from 'modules/stonks/ui/StonksOrderForm'
import { MotionFormComplete } from 'modules/motions/ui/MotionFormComplete'
import { StonksPageContainer } from 'modules/stonks/ui/StonksPageContainer'
import { useAvailableStonks } from 'modules/stonks/hooks/useAvailableStonks'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'

export default function StonksPage() {
  const { isWalletConnected } = useWeb3()
  const openConnectWalletModal = useConnectWalletModal()
  const [complete, setComplete] = useState<ResultTx | null>(null)
  const { areStonksAvailable, initialLoading } = useAvailableStonks()

  if (complete) {
    return (
      <StonksPageContainer
        title="Stonks order created"
        subtitle="Check out transaction status"
      >
        {/* TODO: replace with stonks-specific component */}
        <MotionFormComplete
          resultTx={complete}
          onReset={() => setComplete(null)}
        />
      </StonksPageContainer>
    )
  }

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
      <StonksOrderForm onComplete={setComplete} />
    </StonksPageContainer>
  )
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
