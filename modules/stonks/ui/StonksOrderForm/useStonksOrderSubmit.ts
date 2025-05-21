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

export function useStonksOrderSubmit() {
  const { web3Provider } = useWeb3()
  const [isSubmitting, setSubmitting] = useState(false)
  const [resultTx, setResultTx] = useState<ResultTx | null>(null)

  const sendTransactionGnosisWorkaround = useSendTransactionGnosisWorkaround()

  const populatePlaceOrder = async (
    stonksAddress: string,
    minAcceptableAmount: BigNumber,
  ) => {
    if (!web3Provider) {
      throw new Error('web3Provider not found')
    }

    const stonksContract = StonksAbi__factory.connect(
      stonksAddress,
      web3Provider,
    )
    const gasLimit = await estimateGasFallback(
      stonksContract.estimateGas.placeOrder(minAcceptableAmount),
    )

    const tx = await stonksContract.populateTransaction.placeOrder(
      minAcceptableAmount,
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
        values.stonksAddress,
        parseUnits(
          values.minAcceptableAmount.toString(),
          BigInt(values.tokenToDecimals),
        ),
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
