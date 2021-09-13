import { utils } from 'ethers'
import { useRewardPrograms } from 'modules/motions/hooks/useRewardPrograms'

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
    toastInfo('Confirm transaction with Gnosis Safe')
    const res = await contract.createMotion(evmScriptFactory, encodedCallData, {
      gasLimit: 500000,
    })
    return res
  },
  getDefaultFormData: () => ({
    address: '',
  }),
  Component: function StartNewMotionMotionFormLego({
    fieldNames,
    submitAction,
  }) {
    const { data: rewardPrograms, initialLoading } = useRewardPrograms()

    return (
      <>
        <Fieldset>
          <SelectControl
            label="Reward program address"
            name={fieldNames.address}
            rules={{ required: 'Field is required' }}
          >
            {initialLoading && <Option value="" disabled children="Loading" />}
            {rewardPrograms?.map((program, i) => (
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
