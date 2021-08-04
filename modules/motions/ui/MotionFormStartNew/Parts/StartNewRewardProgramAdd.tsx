import { utils } from 'ethers'

import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Fieldset } from '../CreateMotionFormStyle'

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
    toastInfo('Check Gnosis Safe to confirm transaction')
    const res = await contract.createMotion(evmScriptFactory, encodedCallData, {
      gasLimit: 500000,
    })
    return res
  },
  getDefaultFormData: () => ({
    address: '',
    title: '',
  }),
  getComponent: ({ fieldNames }) =>
    function StartNewMotionMotionFormLego() {
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
        </>
      )
    },
})
