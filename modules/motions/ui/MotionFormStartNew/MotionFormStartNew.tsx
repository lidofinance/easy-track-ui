import { useForm } from 'react-hook-form'
import { useMotionContractGetter } from 'modules/motions/hooks/useMotionContractGetter'

import { Button } from '@lidofinance/lido-ui'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Form } from 'modules/shared/ui/Controls/Form'
import { Wrap, Fieldset } from './CreateMotionFormStyle'

import * as formLEGO from './Parts/StartNewLEGO'
import * as formNodeOperators from './Parts/StartNewNodeOperators'

import { MotionType } from '../../types'
import { useCallback } from 'react'

type FormData = {
  motionType: MotionType | null
  [MotionType.LEGO]: formLEGO.FormData
  [MotionType.NodeOperator]: formNodeOperators.FormData
}

const MotionFormParts = {
  [MotionType.LEGO]: formLEGO.formParts,
  [MotionType.NodeOperator]: formNodeOperators.formParts,
} as const

const getDefaultFormPartsData = () => {
  return Object.entries(MotionFormParts).reduce(
    (res, [type, part]) => ({
      ...res,
      [type]: part.getDefaultFormData(),
    }),
    {} as { [key in MotionType]: FormData[key] },
  )
}

export function MotionFormStartNew() {
  const formMethods = useForm<FormData>({
    defaultValues: {
      motionType: null,
      ...getDefaultFormPartsData(),
    },
  })

  const getContract = useMotionContractGetter()

  const handleSubmit = useCallback(
    e => {
      const motionType = formMethods.getValues('motionType')
      if (!motionType) return
      MotionFormParts[motionType].onSubmit({
        formData: e[motionType],
        contract: getContract(),
      })
    },
    [formMethods, getContract],
  )

  const motionType = formMethods.watch('motionType')
  const CurrentFormPart = motionType
    ? MotionFormParts[motionType].Component
    : null

  return (
    <Wrap>
      <Form formMethods={formMethods} onSubmit={handleSubmit}>
        <Fieldset>
          <SelectControl name="motionType" label="Motion type">
            {Object.values(MotionType).map(type => (
              <Option key={type} value={type} children={type} />
            ))}
          </SelectControl>
        </Fieldset>
        {CurrentFormPart && <CurrentFormPart />}
        {motionType && <Button type="submit" fullwidth children="Submit" />}
      </Form>
    </Wrap>
  )
}
