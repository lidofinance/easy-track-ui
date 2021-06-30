import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Fieldset } from '../CreateMotionFormStyle'

import { MotionType } from '../../../types'
import { createMotionFormPart } from '../createMotionFormPart'

export const formParts = createMotionFormPart({
  motionType: MotionType.NodeOperator,
  getSubmitter:
    ({ evmScriptFactory }) =>
    async ({ formData, contract }) => {
      console.log('Node Operator', formData, contract)
      await contract.createMotion(evmScriptFactory, [1, 2, 3])
    },
  getDefaultFormData: () => ({
    newLimit: '',
  }),
  getComponent: ({ getFieldName }) =>
    function StartNewMotionNodeOperators() {
      return (
        <Fieldset>
          <InputControl name={getFieldName('newLimit')} label="New limit" />
        </Fieldset>
      )
    },
})

export type FormData = ReturnType<typeof formParts.getDefaultFormData>
