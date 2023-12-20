import { Button, Loader } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ResultTx } from 'modules/blockChain/types'
import { useRouter } from 'next/dist/client/router'
import * as urls from 'modules/network/utils/urls'
import {
  Container,
  ErrorMessageBox,
  MessageBox,
} from './StonksOrderProgressStyle'
import { Text } from 'modules/shared/ui/Common/Text'
import { useCallback, useState } from 'react'
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

const STEPS_LABELS: Record<number, string | undefined> = {
  1: 'parse Safe tx',
  2: 'tx receipt fetch',
  3: 'order data fetch',
  4: 'create off-chain order',
} as const

export function StonksOrderProgress({ resultTx, onRetry }: Props) {
  const { chainId, library } = useWeb3()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleErrorSet = (step: number, error?: any) => {
    setIsLoading(false)
    const stepLabel = STEPS_LABELS[step]
    let message = stepLabel ? `Error in ${stepLabel}: ` : ''
    message = `${message}${error?.message ?? 'Something went wrong'}`
    console.error('Create order error', message)
    setErrorMessage(message)
  }

  const finalizeOrder = useCallback(
    async (hash: string) => {
      if (!library) {
        handleErrorSet(0)
        return
      }

      setIsLoading(true)
      setErrorMessage(undefined)

      // step 2: wait for tx success and get tx receipt
      let txReceipt: providers.TransactionReceipt | undefined
      try {
        const tx = await library.getTransaction(hash)
        txReceipt = await tx.wait()
      } catch (error) {
        console.error(error)
        handleErrorSet(2, new Error(`Failed to get tx data, tx hash: ${hash}`))
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
      try {
        await createOffChainOrder(order, chainId)
      } catch (error) {
        handleErrorSet(4, error)
        return
      }

      // step 5: redirect to order page
      router.push(urls.stonksOrder(order.address))
    },
    [chainId, library, router],
  )

  const { data: txHash } = useSWR(
    `stonks-order-tx-hash-${chainId}-${
      resultTx.type === 'safe' ? resultTx.tx.safeTxHash : resultTx.tx.hash
    }`,
    async () => {
      const hash = await getHashFromResultTx(resultTx, chainId)
      return hash
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      onSuccess: finalizeOrder,
      onErrorRetry: (error, _, __, revalidate, { retryCount }) => {
        // Only retry up to 20 times
        if (retryCount >= 20) {
          handleErrorSet(1, error)
          return
        }

        // Retry after 6 seconds
        setTimeout(() => revalidate({ retryCount }), 5000)
      },
    },
  )

  const retryFinalizeOrder = async () => {
    if (!errorMessage) return

    if (!txHash) {
      onRetry()
    } else {
      await finalizeOrder(txHash)
    }
  }

  return (
    <Container>
      <MessageBox>
        <Text size={14} weight={500}>
          Waiting for tx hash...
        </Text>
        {txHash && (
          <Text size={14} weight={500}>
            Creating off-chain order...
          </Text>
        )}
      </MessageBox>
      {isLoading && <Loader />}
      {errorMessage && (
        <>
          <ErrorMessageBox>{errorMessage}</ErrorMessageBox>
          <Button fullwidth onClick={retryFinalizeOrder}>
            Retry
          </Button>
        </>
      )}
    </Container>
  )
}
