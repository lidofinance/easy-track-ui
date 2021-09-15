import { utils } from 'ethers'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useRewardPrograms } from 'modules/motions/hooks/useRewardPrograms'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Fieldset, MessageBox } from '../CreateMotionFormStyle'

import { ContractEvmRewardProgramRemove } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'

export const formParts = createMotionFormPart({
  motionType: MotionType.RewardProgramRemove,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address'],
      [utils.getAddress(formData.address)],
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
  }),
  Component: function StartNewMotionMotionFormLego({
    fieldNames,
    submitAction,
  }) {
    const rewardPrograms = useRewardPrograms()
    const { walletAddress } = useWalletInfo()
    const trustedCaller = ContractEvmRewardProgramRemove.useSwrWeb3(
      'trustedCaller',
      [],
    )
    const isTrustedCallerConnected = trustedCaller.data === walletAddress

    if (trustedCaller.initialLoading || rewardPrograms.initialLoading) {
      return <PageLoader />
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    return (
      <>
        <Fieldset>
          <SelectControl
            label="Reward program address"
            name={fieldNames.address}
            rules={{ required: 'Field is required' }}
          >
            {rewardPrograms.data?.map((program, i) => (
              <Option
                key={i}
                value={program.address}
                children={`${program.title}`}
              />
            ))}
          </SelectControl>
        </Fieldset>

        {submitAction}
      </>
    )
  },
})
