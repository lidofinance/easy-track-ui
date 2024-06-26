import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { Container } from './StonksOrderProgressStyle'
import { Text } from 'modules/shared/ui/Common/Text'
import { useEffect, useState } from 'react'
import { TxStatus } from 'modules/blockChain/types'
import {
  Hash,
  Status,
  StatusLoader,
  StatusWrap,
} from 'modules/motions/ui/MotionFormComplete/MotionFormCompleteStyle'
import { useEtherscanOpen } from '@lido-sdk/react'
import { CopyOpenActions } from 'modules/shared/ui/Common/CopyOpenActions'
import { useRouter } from 'next/router'
import { stonksOrder } from 'modules/network/utils/urls'
import type { TransactionReceipt } from '@ethersproject/providers'
import { getOrderByPlaceTxReceipt } from 'modules/stonks/utils/getOrderByPlaceTxReceipt'

const getStatusText = (status: TxStatus) =>
  status === 'failed'
    ? 'Failed (click to see why)'
    : status === 'success'
    ? 'Confirmed'
    : 'Pending'

type Props = {
  txHash: string
}

export function StonksOrderProgressRegular({ txHash }: Props) {
  const { library } = useWeb3()
  const router = useRouter()
  const [status, setStatus] = useState<TxStatus>('pending')
  const openEtherscan = useEtherscanOpen(txHash, 'tx')

  useEffect(() => {
    if (!library) return

    const checkTransaction = (receipt: TransactionReceipt | undefined) => {
      if (!receipt) {
        setStatus('pending')
      } else if (receipt.status === 1) {
        const orderFromReceipt = getOrderByPlaceTxReceipt(receipt)
        router.push(stonksOrder(orderFromReceipt.address))
      } else if (receipt.status === 0) {
        setStatus('failed')
      }
    }

    library.getTransactionReceipt(txHash).then(checkTransaction)
    library.on(txHash, checkTransaction)

    return () => {
      library.off(txHash)
    }
  }, [library, router, txHash])

  return (
    <Container>
      <StatusWrap>
        Status:
        <Status status={status} onClick={openEtherscan}>
          {getStatusText(status)}
        </Status>
        {status === 'pending' && <StatusLoader />}
      </StatusWrap>
      <Text size={14} weight={500}>
        Transaction hash:
      </Text>
      <Hash>{txHash}</Hash>
      <CopyOpenActions value={txHash} entity="tx" />
    </Container>
  )
}
