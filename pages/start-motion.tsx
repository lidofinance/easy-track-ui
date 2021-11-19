import { useState } from 'react'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'

import { Container, Button } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { MotionFormStartNew } from 'modules/motions/ui/MotionFormStartNew'
import { MotionFormComplete } from 'modules/motions/ui/MotionFormComplete'
import { MessageBox } from 'modules/motions/ui/MotionFormStartNew/CreateMotionFormStyle'
import { ResultTx } from 'modules/blockChain/types'

export default function StartMotionPage() {
  const { isWalletConnected } = useWalletInfo()
  const openConnectWalletModal = useConnectWalletModal()
  const [complete, setComplete] = useState<ResultTx | null>(null)

  if (complete) {
    return (
      <Container as="main" size="tight">
        <Title
          title="Motion transaction created"
          subtitle="Check out transaction status"
        />
        <MotionFormComplete
          resultTx={complete}
          onReset={() => setComplete(null)}
        />
      </Container>
    )
  }

  return (
    <Container as="main" size="tight">
      <Title title="Start Motion" subtitle="Fill in the fields below" />
      {!isWalletConnected && (
        <div>
          <MessageBox>Connect your wallet first</MessageBox>
          <br />
          <Button
            type="submit"
            fullwidth
            children="Connect wallet"
            onClick={openConnectWalletModal}
          />
        </div>
      )}
      {isWalletConnected && <MotionFormStartNew onComplete={setComplete} />}
    </Container>
  )
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
