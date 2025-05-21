import { useState } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { Container } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { MotionFormStartNew } from 'modules/motions/ui/MotionFormStartNew'
import { MotionFormComplete } from 'modules/motions/ui/MotionFormComplete'
import { MessageBox } from 'modules/motions/ui/MotionFormStartNew/CreateMotionFormStyle'
import { ResultTx } from 'modules/blockChain/types'
import { ConnectWalletButton } from 'modules/wallet/ui/ConnectWalletButton'

export default function StartMotionPage() {
  const { isWalletConnected } = useWeb3()
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
          <ConnectWalletButton
            type="submit"
            fullwidth
            children="Connect wallet"
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
