import { Button, Loader } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ResultTx } from 'modules/blockChain/types'
import { useRouter } from 'next/dist/client/router'
import * as urls from 'modules/network/utils/urls'
import { Container, MessageBox } from './StonksOrderProgressStyle'
import { Text } from 'modules/shared/ui/Common/Text'
import { useCallback, useEffect, useState } from 'react'
import { providers } from 'ethers'
import { getOrderByPlaceTxReceipt } from 'modules/stonks/utils/getOrderByPlaceTxReceipt'
import { Order } from 'modules/stonks/types'
import { getHashFromResultTx } from 'modules/blockChain/utils/getHashFromResultTx'
import { createOffChainOrder } from 'modules/stonks/utils/createOffChainOrder'
import { useSWR } from 'modules/network/hooks/useSwr'

type Props = {
  resultTx: ResultTx
  onRetry: () => void
}

const FINAL_STEPS: Record<number, string | undefined> = {
  1: 'parse Safe tx',
  2: 'tx receipt fetch',
  3: 'order data fetch',
  4: 'create off-chain order',
} as const

export function StonksOrderProgress({ resultTx, onRetry }: Props) {
  const { chainId, library } = useWeb3()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [errorObj, setErrorObj] = useState<{ step: number; message: string }>()

  const handleErrorSet = (step: number, error?: any) => {
    setIsLoading(false)
    const stepLabel = FINAL_STEPS[step]
    let message = stepLabel ? `${stepLabel}: ` : ''
    message = `${message}${error?.message ?? 'Something went wrong'}`
    console.error('Error', message)
    setErrorObj({ step, message })
  }

  const { data: txHash } = useSWR(
    `stonks-order-tx-hash-${chainId}-${
      resultTx.type === 'safe' ? resultTx.tx.safeTxHash : resultTx.tx.hash
    }`,
    async () => getHashFromResultTx(resultTx, chainId),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      onErrorRetry: (error, _, __, revalidate, { retryCount }) => {
        // Only retry up to 20 times.
        if (retryCount >= 20) {
          handleErrorSet(1, error)
          return
        }

        // Retry after 6 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000)
      },
    },
  )

  const finalizeOrder = useCallback(async () => {
    if (!library || !txHash) {
      handleErrorSet(0)
      return
    }

    setIsLoading(true)
    setErrorObj(undefined)

    // step 2: wait for tx success and get tx receipt
    let txReceipt: providers.TransactionReceipt | undefined
    try {
      const tx = await library.getTransaction(txHash)
      txReceipt = await tx.wait()
    } catch (error) {
      console.error(error)
      handleErrorSet(2, new Error(`Failed to get tx data, tx hash: ${txHash}`))
      return
    }

    // step 3: get order data from tx receipt
    let order: Order | undefined
    try {
      order = getOrderByPlaceTxReceipt(txReceipt)
    } catch (error) {
      handleErrorSet(3, error)
      return
    }

    // step 4: create an off-chain order using order data
    let orderUid: string | undefined
    try {
      orderUid = await createOffChainOrder(order, chainId)
    } catch (error) {
      handleErrorSet(4, error)
      return
    }

    // step 5: redirect to order page
    router.push(urls.stonksOrder(orderUid))
  }, [chainId, library, router, txHash])

  const retryFinalizeOrder = async () => {
    if (!errorObj) return

    if (errorObj.step <= 1) {
      onRetry()
    } else {
      await finalizeOrder()
    }
  }

  useEffect(() => {
    if (txHash) {
      finalizeOrder()
    }
  }, [txHash, finalizeOrder])

  return (
    <Container>
      {isLoading && (
        <>
          <MessageBox>
            <Text size={14} weight={500}>
              {txHash
                ? 'Creating off-chain order...'
                : 'Waiting for tx hash...'}
            </Text>
          </MessageBox>
          <Loader />
        </>
      )}
      {errorObj && (
        <>
          <MessageBox>
            <Text size={14} weight={500}>
              Error in {errorObj.message}
            </Text>
          </MessageBox>
          <Button fullwidth onClick={retryFinalizeOrder}>
            Retry
          </Button>
        </>
      )}
    </Container>
  )
}
