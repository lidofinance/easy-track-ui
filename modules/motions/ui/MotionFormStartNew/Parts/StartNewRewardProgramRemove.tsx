import { utils } from 'ethers'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useRewardProgramsActual } from 'modules/motions/hooks/useRewardPrograms'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Fieldset, MessageBox } from '../CreateMotionFormStyle'

import { ContractEvmRewardProgramRemove } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils/estimateGasFallback'

/**
 * @deprecated
 */
export const formParts = createMotionFormPart({
  motionType: MotionType.RewardProgramRemove,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address'],
      [utils.getAddress(formData.address)],
    )
    const gasLimit = await estimateGasFallback(
      contract.estimateGas.createMotion(evmScriptFactory, encodedCallData),
    )
    const tx = await contract.populateTransaction.createMotion(
      evmScriptFactory,
      encodedCallData,
      { gasLimit },
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
    const rewardPrograms = useRewardProgramsActual()
    const { walletAddress } = useWeb3()
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
