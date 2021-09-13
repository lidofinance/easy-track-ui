import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'

import { Container, Button } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { MotionFormStartNew } from 'modules/motions/ui/MotionFormStartNew'
import { MessageBox } from 'modules/motions/ui/MotionFormStartNew/CreateMotionFormStyle'

export default function StartMotionPage() {
  const { isWalletConnected } = useWalletInfo()
  const openConnectWalletModal = useConnectWalletModal()

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
      {isWalletConnected && <MotionFormStartNew />}
    </Container>
  )
}
