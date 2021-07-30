import { utils } from 'ethers'

import { useContractRpcSwr } from 'modules/blockChain/hooks/useContractRpcSwr'
import { useContractRewardProgramRegistryRpc } from 'modules/blockChain/hooks/useContractRewardProgramRegistry'

import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Fieldset } from '../CreateMotionFormStyle'

import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { toastInfo } from 'modules/toasts'

export const formParts = createMotionFormPart({
  motionType: MotionType.RewardProgramRemove,
  onSubmit: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address'],
      [utils.getAddress(formData.address)],
    )
    toastInfo('Check Gnosis Safe to confirm transaction')
    const res = await contract.createMotion(evmScriptFactory, encodedCallData, {
      gasLimit: 500000,
    })
    return res
  },
  getDefaultFormData: () => ({
    address: '',
  }),
  getComponent: ({ fieldNames }) =>
    function StartNewMotionMotionFormLego() {
      const contract = useContractRewardProgramRegistryRpc()
      const { data: rewardPrograms, initialLoading } = useContractRpcSwr(
        contract,
        'getRewardPrograms',
      )

      return (
        <Fieldset>
          <SelectControl
            label="Reward program address"
            name={fieldNames.address}
            rules={{ required: 'Field is required' }}
          >
            {initialLoading && <Option value="" disabled children="Loading" />}
            {rewardPrograms?.map((value, i) => (
              <Option key={i} value={value} children={value} />
            ))}
          </SelectControl>
        </Fieldset>
      )
    },
})
