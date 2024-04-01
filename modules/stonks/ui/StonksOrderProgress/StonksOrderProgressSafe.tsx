import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { Container, Hash, MessageBox } from './StonksOrderProgressStyle'
import { Text } from 'modules/shared/ui/Common/Text'
import { useGnosisOpener } from 'modules/blockChain/hooks/useGnosisOpener'
import { ButtonExternalView } from 'modules/shared/ui/Common/ButtonExternalView'
import { Button } from '@lidofinance/lido-ui'
import { useRouter } from 'next/router'
import { stonks } from 'modules/network/utils/urls'

type Props = {
  safeTxHash: string
}

export function StonksOrderProgressSafe({ safeTxHash }: Props) {
  const { walletAddress } = useWeb3()
  const router = useRouter()
  const openGnosis = useGnosisOpener(String(walletAddress), safeTxHash)

  return (
    <Container>
      <MessageBox>
        <Text size={14} weight={500}>
          Safe transaction hash:
        </Text>
        <Hash>{safeTxHash}</Hash>
        <ButtonExternalView onClick={openGnosis} children="View at Safe" />
      </MessageBox>
      <MessageBox>
        <Text size={14} weight={500}>
          Once the transaction has been signed and executed, return to the
          Stonks page and enter the tx hash to continue order creation.
        </Text>
        <Button size="sm" onClick={() => router.push(stonks)}>
          Back to Stonks
        </Button>
      </MessageBox>
    </Container>
  )
}
