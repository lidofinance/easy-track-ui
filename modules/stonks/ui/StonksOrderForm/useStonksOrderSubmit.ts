import { ToastError } from '@lidofinance/lido-ui'
import { BigNumber } from 'ethers'
import { StonksAbi__factory } from 'generated'
import { useSendTransactionGnosisWorkaround } from 'modules/blockChain/hooks/useSendTransactionGnosisWorkaround'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ResultTx } from 'modules/blockChain/types'
import { estimateGasFallback } from 'modules/motions/utils'
import { getErrorMessage } from 'modules/shared/utils/getErrorMessage'
import { useState } from 'react'
import { FormData } from './types'
import { parseUnits } from 'ethers/lib/utils'
import { StonksData } from 'modules/stonks/types'

export function useStonksOrderSubmit(stonksPairData: StonksData) {
  const { library } = useWeb3()
  const [isSubmitting, setSubmitting] = useState(false)
  const [resultTx, setResultTx] = useState<ResultTx | null>(null)

  const sendTransactionGnosisWorkaround = useSendTransactionGnosisWorkaround()

  const populatePlaceOrder = async (
    sellAmount: BigNumber,
    minBuyAmount: BigNumber,
  ) => {
    if (!library) {
      throw new Error('Library not found')
    }

    const stonksContract = StonksAbi__factory.connect(
      stonksPairData.address,
      library,
    )
    if (stonksPairData.version === 'v1') {
      const gasLimit = await estimateGasFallback(
        stonksContract.estimateGas.placeOrder(minBuyAmount),
      )

      const tx = await stonksContract.populateTransaction.placeOrder(
        minBuyAmount,
        {
          gasLimit,
        },
      )
      return tx
    }

    const gasLimit = await estimateGasFallback(
      stonksContract.estimateGas.placeOrderWithAmount(sellAmount, minBuyAmount),
    )

    const tx = await stonksContract.populateTransaction.placeOrderWithAmount(
      sellAmount,
      minBuyAmount,
      {
        gasLimit,
      },
    )
    return tx
  }

  const handleSubmit = async (values: FormData) => {
    try {
      setSubmitting(true)
      const populatedTx = await populatePlaceOrder(
        parseUnits(values.sellAmount, stonksPairData.tokenTo.decimals),
        parseUnits(values.minBuyAmount, stonksPairData.tokenTo.decimals),
      )
      const res = await sendTransactionGnosisWorkaround(populatedTx)
      setResultTx(res)
    } catch (error: any) {
      console.error(error)
      ToastError(getErrorMessage(error), {})
    } finally {
      setSubmitting(false)
    }
  }

  return { isSubmitting, resultTx, handleSubmit }
}
