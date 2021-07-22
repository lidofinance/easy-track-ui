import { utils } from 'ethers'

import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Fieldset } from '../CreateMotionFormStyle'

import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'

export const formParts = createMotionFormPart({
  motionType: MotionType.RewardProgramAdd,
  onSubmit: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address'],
      [utils.getAddress(formData.address)],
    )
    await contract.createMotion(evmScriptFactory, encodedCallData, {
      gasLimit: 500000,
    })
  },
  getDefaultFormData: () => ({
    address: '',
  }),
  getComponent: ({ fieldNames }) =>
    function StartNewMotionMotionFormLego() {
      return (
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
      )
    },
})
