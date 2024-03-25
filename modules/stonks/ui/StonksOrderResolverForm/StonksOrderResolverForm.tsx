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

type FormData = {
  txHashOrAddress: string
}

export function StonksOrderResolverForm() {
  const { chainId, library } = useWeb3()
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

  const handleSubmit = async (values: FormData) => {
    if (!library) return
    try {
      const isAddress = utils.isAddress(values.txHashOrAddress)
      if (isAddress) {
        const orderContract = connectContractRpc(
          StonksOrderAbi__factory,
          values.txHashOrAddress,
          chainId,
        )

        try {
          await orderContract.stonks()
          router.push(urls.stonksOrder(values.txHashOrAddress))
        } catch (error) {
          throw new Error('Invalid order address')
        }
      } else {
        try {
          const txReceipt = await library.getTransactionReceipt(
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
        />
        <Button fullwidth type="submit" loading={isSubmitting}>
          Go to order
        </Button>
      </Fieldset>
    </Form>
  )
}
