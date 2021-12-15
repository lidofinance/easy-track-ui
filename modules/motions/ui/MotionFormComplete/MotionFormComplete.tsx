import { useState, useEffect } from 'react'
import { useWeb3 } from '@lido-sdk/web3-react'
import { useGnosisOpener } from 'modules/blockChain/hooks/useGnosisOpener'
import { useEtherscanOpen } from '@lido-sdk/react'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'

import { Button } from '@lidofinance/lido-ui'
import { Text } from 'modules/shared/ui/Common/Text'
import { CopyOpenActions } from 'modules/shared/ui/Common/CopyOpenActions'
import { ButtonExternalView } from 'modules/shared/ui/Common/ButtonExternalView'
import {
  MessageBox,
  Fieldset,
} from '../MotionFormStartNew/CreateMotionFormStyle'
import {
  Hash,
  Status,
  StatusWrap,
  StatusLoader,
} from './MotionFormCompleteStyle'

import { ResultTx, SafeTx, TxStatus } from 'modules/blockChain/types'
import { ContractTransaction } from '@ethersproject/contracts'

type BodySafeProps = {
  tx: SafeTx
}

// Can be improved with https://safe-transaction.rinkeby.gnosis.io/
function BodySafe({ tx }: BodySafeProps) {
  const { walletAddress } = useWalletInfo()
  const openGnosis = useGnosisOpener(
    String(walletAddress),
    '/transactions/queue',
  )
  return (
    <div>
      <Text size={14} weight={500}>
        Gnosis Safe transaction hash:
      </Text>
      <Hash>{tx.safeTxHash}</Hash>
      <ButtonExternalView onClick={openGnosis} children="View at gnosis safe" />
    </div>
  )
}

type BodyRegularProps = {
  tx: ContractTransaction
}

function BodyRegular({ tx }: BodyRegularProps) {
  const { library } = useWeb3()
  const openEtherscan = useEtherscanOpen(tx.hash, 'tx')
  const [status, setStatus] = useState<TxStatus>('pending')

  useEffect(() => {
    if (!library) return

    const checkTransaction = (e: any) => {
      if (!e) {
        setStatus('pending')
      } else if (e.status === 1) {
        setStatus('success')
      } else if (e.status === 0) {
        setStatus('failed')
      }
    }

    library.getTransactionReceipt(tx.hash).then(checkTransaction)
    library.on(tx.hash, checkTransaction)

    return () => {
      library.off(tx.hash)
    }
  }, [library, tx.hash])

  const renderStatusText = () =>
    status === 'failed'
      ? 'Failed (click to see why)'
      : status === 'success'
      ? 'Confirmed'
      : 'Pending'

  return (
    <>
      <StatusWrap>
        Status:
        <Status status={status} onClick={openEtherscan}>
          {renderStatusText()}
        </Status>
        {status === 'pending' && <StatusLoader />}
      </StatusWrap>
      <Text size={14} weight={500}>
        Transaction hash:
      </Text>
      <Hash>{tx.hash}</Hash>
      <CopyOpenActions value={tx.hash} entity="tx" />
    </>
  )
}

type Props = {
  resultTx: ResultTx
  onReset: () => void
}

export function MotionFormComplete({ resultTx, onReset }: Props) {
  return (
    <>
      <MessageBox>
        {resultTx.type === 'safe' ? (
          <BodySafe tx={resultTx.tx} />
        ) : (
          <BodyRegular tx={resultTx.tx} />
        )}
      </MessageBox>
      <Fieldset>
        <Button variant="filled" onClick={onReset} fullwidth>
          Create another Motion
        </Button>
      </Fieldset>
    </>
  )
}
