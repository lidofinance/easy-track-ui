import { Button } from '@lidofinance/lido-ui'
import { StonksOrderAbi__factory } from 'generated'
import { useTransactionSender } from 'modules/blockChain/hooks/useTransactionSender'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { estimateGasFallback } from 'modules/motions/utils'
import { ConnectWalletButton } from 'modules/wallet/ui/ConnectWalletButton'
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
  const { web3Provider, isWalletConnected } = useWeb3()

  const populateRecover = async () => {
    if (!web3Provider) {
      throw new Error('web3Provider not found')
    }

    const orderContract = StonksOrderAbi__factory.connect(
      orderAddress,
      web3Provider,
    )

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
      {isWalletConnected ? (
        <Button
          onClick={txRecover.isEmpty ? txRecover.send : undefined}
          loading={txRecover.isPending}
          disabled={!txRecover.isEmpty}
          fullwidth
          variant={variant}
        >
          Recover funds
        </Button>
      ) : (
        <ConnectWalletButton
          type="submit"
          fullwidth
          children="Connect wallet to recover funds"
        />
      )}
    </ButtonWrap>
  )
}
