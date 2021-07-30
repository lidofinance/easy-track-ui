import { utils } from 'ethers'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Fieldset } from '../CreateMotionFormStyle'

import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'

export const formParts = createMotionFormPart({
  motionType: MotionType.NodeOperatorIncreaseLimit,
  onSubmit: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['uint256', 'uint256'],
      [Number(formData.nodeOperatorId), Number(formData.newLimit)],
    )
    const res = await contract.createMotion(evmScriptFactory, encodedCallData, {
      gasLimit: 500000,
    })
    return res
  },
  getDefaultFormData: () => ({
    newLimit: '',
    nodeOperatorId: '',
  }),
  getComponent: ({ fieldNames }) =>
    function StartNewMotionNodeOperators() {
      return (
        <>
          <Fieldset>
            <InputControl
              name={fieldNames.nodeOperatorId}
              label="Node operator id"
            />
          </Fieldset>
          <Fieldset>
            <InputControl name={fieldNames.newLimit} label="New limit" />
          </Fieldset>
        </>
      )
    },
})
