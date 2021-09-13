import { utils } from 'ethers'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Fieldset, MessageBox } from '../CreateMotionFormStyle'

import { ContractEvmRewardProgramAdd } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { toastInfo } from 'modules/toasts'

export const formParts = createMotionFormPart({
  motionType: MotionType.RewardProgramAdd,
  onSubmit: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address', 'string'],
      [utils.getAddress(formData.address), formData.title],
    )
    toastInfo('Confirm transaction with Gnosis Safe')
    const res = await contract.createMotion(evmScriptFactory, encodedCallData, {
      gasLimit: 500000,
    })
    return res
  },
  getDefaultFormData: () => ({
    address: '',
    title: '',
  }),
  Component: function StartNewMotionMotionFormLego({
    fieldNames,
    submitAction,
  }) {
    const { walletAddress } = useWalletInfo()
    const trustedCaller = ContractEvmRewardProgramAdd.useSwrWeb3(
      'trustedCaller',
      [],
    )
    const isTrustedCallerConnected = trustedCaller.data === walletAddress

    if (trustedCaller.initialLoading) {
      return <PageLoader />
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    return (
      <>
        <Fieldset>
          <InputControl
            name={fieldNames.title}
            label="Title"
            rules={{ required: 'Field is required' }}
          />
        </Fieldset>

        <Fieldset>
          <InputControl
            name={fieldNames.address}
            label="Address"
            rules={{
              required: 'Field is required',
              validate: value =>
                utils.isAddress(value) ? true : 'Address is not valid',
            }}
          />
        </Fieldset>

        {submitAction}
      </>
    )
  },
})
