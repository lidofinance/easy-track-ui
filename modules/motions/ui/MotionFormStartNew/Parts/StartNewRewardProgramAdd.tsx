import { utils } from 'ethers'
import { useMemo } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useRewardProgramsActual } from 'modules/motions/hooks/useRewardPrograms'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Fieldset, MessageBox } from '../CreateMotionFormStyle'

import { ContractEvmRewardProgramAdd } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils/estimateGasFallback'

export const formParts = createMotionFormPart({
  motionType: MotionType.RewardProgramAdd,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address', 'string'],
      [utils.getAddress(formData.address), formData.title],
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
    title: '',
  }),
  Component: function StartNewMotionMotionFormLego({
    fieldNames,
    submitAction,
  }) {
    const { walletAddress } = useWeb3()
    const rewardPrograms = useRewardProgramsActual()
    const trustedCaller = ContractEvmRewardProgramAdd.useSwrWeb3(
      'trustedCaller',
      [],
    )
    const isTrustedCallerConnected = trustedCaller.data === walletAddress

    const existedAddresses = useMemo(() => {
      return (rewardPrograms.data || []).map(({ address }) => address)
    }, [rewardPrograms.data])

    if (trustedCaller.initialLoading || rewardPrograms.initialLoading) {
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
              validate: value => {
                if (!utils.isAddress(value)) return 'Address is not valid'
                if (existedAddresses.includes(value)) {
                  return 'Reward programm with this address already exists'
                }
                return true
              },
            }}
          />
        </Fieldset>

        {submitAction}
      </>
    )
  },
})
