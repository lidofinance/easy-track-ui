// import ethers from 'ethers'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Fieldset } from '../CreateMotionFormStyle'

import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'

export const formParts = createMotionFormPart({
  motionType: MotionType.RewardProgramTopUp,
  onSubmit: async ({ evmScriptFactory, formData, contract }) => {
    console.log('RewardProgramTopUp', formData, contract)
    await contract.createMotion(evmScriptFactory, [0, 1, 2])
  },
  getDefaultFormData: () => ({
    test: '',
  }),
  getComponent: ({ getFieldName }) =>
    function StartNewMotionMotionFormLego() {
      return (
        <Fieldset>
          <InputControl name={getFieldName('test')} label="test" />
        </Fieldset>
      )
    },
})
