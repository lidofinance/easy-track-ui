import { Button } from '@lidofinance/lido-ui'
import { StonksOrderAbi__factory } from 'generated'
import { useTransactionSender } from 'modules/blockChain/hooks/useTransactionSender'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { estimateGasFallback } from 'modules/motions/utils'
import { ButtonWrap } from '../StonksOrderCardStyle'

type Props = {
  orderAddress: string
  variant?: React.ComponentProps<typeof Button>['variant']
  onFinish?: () => void
}

export function StonksOrderCardRecoverButton({
  orderAddress,
  variant,
  onFinish,
}: Props) {
  const { library, isWalletConnected } = useWeb3()

  const populateRecover = async () => {
    if (!library) {
      throw new Error('Library not found')
    }

    const orderContract = StonksOrderAbi__factory.connect(orderAddress, library)

    const gasLimit = await estimateGasFallback(
      orderContract.estimateGas.recoverTokenFrom(),
    )

    return orderContract.populateTransaction.recoverTokenFrom({
      gasLimit,
    })
  }

  const txRecover = useTransactionSender(populateRecover, {
    onFinish,
  })

  return (
    <ButtonWrap>
      <Button
        onClick={txRecover.isEmpty ? txRecover.send : undefined}
        loading={txRecover.isPending}
        disabled={!isWalletConnected || !txRecover.isEmpty}
        fullwidth
        variant={variant}
      >
        Recover funds
      </Button>
    </ButtonWrap>
  )
}
