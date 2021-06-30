// import ethers from 'ethers'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Fieldset } from '../CreateMotionFormStyle'

import { MotionType } from '../../../types'
import { createMotionFormPart } from '../createMotionFormPart'

export const formParts = createMotionFormPart({
  motionType: MotionType.LEGO,
  getSubmitter:
    ({ evmScriptFactory }) =>
    async ({ formData, contract }) => {
      console.log('Lego', formData, contract)

      // contract.encode

      // const encoded = contract.interface.encodeFunctionData('createMotion', [
      //   '123',
      //   '12',
      // ])
      // console.log(encoded)

      // const iface = new ethers.utils.Interface(abi);
      // const callData = iface.functions.myFunction.encode(…args);

      await contract.createMotion(evmScriptFactory, [0, 1, 2])
    },
  getDefaultFormData: () => ({
    token: '',
  }),
  getComponent: ({ getFieldName }) =>
    function StartNewMotionMotionFormLego() {
      return (
        <Fieldset>
          <InputControl name={getFieldName('token')} label="Token" />
        </Fieldset>
      )
    },
})

export type FormData = ReturnType<typeof formParts.getDefaultFormData>
