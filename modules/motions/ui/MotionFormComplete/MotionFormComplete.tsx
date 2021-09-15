import { Web3Provider } from '@ethersproject/providers'

import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useGnosisOpener } from 'modules/blockChain/hooks/useGnosisOpener'
import { useEtherscanOpener } from 'modules/blockChain/hooks/useEtherscanOpener'
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

import { ResultTx, SafeTx } from 'modules/blockChain/types'
import { ContractTransaction } from '@ethersproject/contracts'

type BodySafeProps = {
  tx: SafeTx
}

// Can be improved with https://safe-transaction.rinkeby.gnosis.io/
function BodySafe({ tx }: BodySafeProps) {
  const { walletAddress } = useWalletInfo()
  const openGnosis = useGnosisOpener(String(walletAddress), '/transactions')
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
  const { library } = useWeb3React<Web3Provider>()
  const openEtherscan = useEtherscanOpener(tx.hash, 'tx')
  const [status, setStatus] = useState<'pending' | 'failed' | 'confirmed'>(
    'pending',
  )

  useEffect(() => {
    if (!library) return

    const checkTransaction = (e: any) => {
      if (!e) {
        setStatus('pending')
      } else if (e.status === 1) {
        setStatus('confirmed')
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
      : status === 'confirmed'
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
