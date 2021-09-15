import { utils } from 'ethers'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Fieldset, MessageBox } from '../CreateMotionFormStyle'

import { ContractEvmRewardProgramAdd } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'

export const formParts = createMotionFormPart({
  motionType: MotionType.RewardProgramAdd,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address', 'string'],
      [utils.getAddress(formData.address), formData.title],
    )
    const tx = await contract.populateTransaction.createMotion(
      evmScriptFactory,
      encodedCallData,
      {
        gasLimit: 500000,
      },
    )
    return tx
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
