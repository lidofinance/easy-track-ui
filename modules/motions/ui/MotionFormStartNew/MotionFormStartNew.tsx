import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useMotionContractWeb3 } from 'modules/motions/hooks/useMotionContract'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { Button } from '@lidofinance/lido-ui'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Form } from 'modules/shared/ui/Controls/Form'
import { Fieldset } from './CreateMotionFormStyle'

import { MotionType } from '../../types'
import { FormParts, FormData, getDefaultFormPartsData } from './Parts'
import { getScriptFactoryByMotionType } from 'modules/motions/utils/getMotionType'

export function MotionFormStartNew() {
  const currentChainId = useCurrentChain()

  const formMethods = useForm<FormData>({
    defaultValues: {
      motionType: null,
      ...getDefaultFormPartsData(),
    },
  })

  const motionContract = useMotionContractWeb3()

  const handleSubmit = useCallback(
    e => {
      const motionType = formMethods.getValues('motionType')
      if (!motionType) return
      FormParts[motionType].onSubmit({
        evmScriptFactory: getScriptFactoryByMotionType(
          currentChainId,
          motionType,
        ),
        formData: e[motionType],
        contract: motionContract,
      })
    },
    [currentChainId, formMethods, motionContract],
  )

  const motionType = formMethods.watch('motionType')
  const CurrentFormPart = motionType ? FormParts[motionType].Component : null

  return (
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
  )
}
