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
import { CopyOpenActions } from 'modules/shared/ui/Common/CopyOpenActions'
import { useRouter } from 'next/router'
import { stonksOrder } from 'modules/network/utils/urls'
import type { TransactionReceipt } from '@ethersproject/providers'
import { getOrderByPlaceTxReceipt } from 'modules/stonks/utils/getOrderByPlaceTxReceipt'
import { useEtherscanOpener } from 'modules/blockChain/hooks/useEtherscanOpener'

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
  const { rpcProvider } = useWeb3()
  const router = useRouter()
  const [status, setStatus] = useState<TxStatus>('pending')
  const openEtherscan = useEtherscanOpener(txHash, 'tx')

  useEffect(() => {
    if (!rpcProvider) return

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

    rpcProvider.getTransactionReceipt(txHash).then(checkTransaction)
    rpcProvider.on(txHash, checkTransaction)

    return () => {
      rpcProvider.off(txHash)
    }
  }, [rpcProvider, router, txHash])

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
