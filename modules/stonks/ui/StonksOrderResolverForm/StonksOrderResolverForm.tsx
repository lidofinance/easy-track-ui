import { Button, ToastError } from '@lidofinance/lido-ui'
import { useForm } from 'react-hook-form'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { utils } from 'ethers'
import { connectContractRpc } from 'modules/motions/utils/connectContractRpc'
import { StonksOrderAbi__factory } from 'generated'
import * as urls from 'modules/network/utils/urls'
import { useRouter } from 'next/dist/client/router'
import { getOrderByPlaceTxReceipt } from 'modules/stonks/utils/getOrderByPlaceTxReceipt'
import { Fieldset } from './StonksOrderResolverFormStyle'
import { Form } from 'modules/shared/ui/Controls/Form'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { getLimitedJsonRpcBatchProvider } from 'modules/blockChain/utils/limitedJsonRpcBatchProvider'
import { useMemo } from 'react'
import { useConfig } from 'modules/config/hooks/useConfig'

type FormData = {
  txHashOrAddress: string
}

export function StonksOrderResolverForm() {
  const { chainId } = useWeb3()
  const { getRpcUrl } = useConfig()
  const router = useRouter()

  const formMethods = useForm<FormData>({
    defaultValues: {
      txHashOrAddress: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  })

  const { isSubmitting } = formMethods.formState

  const provider = useMemo(
    () => getLimitedJsonRpcBatchProvider(chainId, getRpcUrl(chainId)),
    [chainId, getRpcUrl],
  )

  const handleSubmit = async (values: FormData) => {
    try {
      if (utils.isAddress(values.txHashOrAddress)) {
        const orderContract = connectContractRpc(
          StonksOrderAbi__factory,
          values.txHashOrAddress,
          chainId,
          getRpcUrl(chainId),
        )

        try {
          await orderContract.stonks()
          router.push(urls.stonksOrder(values.txHashOrAddress))
        } catch (error) {
          throw new Error('Invalid order address')
        }
      } else {
        try {
          const txReceipt = await provider.getTransactionReceipt(
            values.txHashOrAddress,
          )
          const orderFromReceipt = getOrderByPlaceTxReceipt(txReceipt)
          router.push(urls.stonksOrder(orderFromReceipt.address))
        } catch (error) {
          throw new Error('Invalid tx hash')
        }
      }
    } catch (error: any) {
      console.error(error)
      ToastError(error?.message, {})
    }
  }

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      <Fieldset>
        <InputControl
          fullwidth
          name="txHashOrAddress"
          placeholder="Order creation tx hash or order address"
          autoComplete="off"
          id="search-address"
          rules={{
            required: 'Field is required',
            validate: value => {
              const addressErr = validateAddress(value)
              const isValidTxHash = /^0x[a-fA-F0-9]{64}$/.test(value)
              if (addressErr && !isValidTxHash) {
                return 'Invalid tx hash or address'
              }
            },
          }}
        />
        <Button
          fullwidth
          type="submit"
          loading={isSubmitting}
          disabled={!formMethods.formState.isValid}
        >
          Find order
        </Button>
      </Fieldset>
    </Form>
  )
}
