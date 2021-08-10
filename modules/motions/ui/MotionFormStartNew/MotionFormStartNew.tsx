import {
  useCallback,
  // useState
} from 'react'
import { useForm } from 'react-hook-form'
import { useContractMotionWeb3 } from 'modules/blockChain/hooks/useContractMotion'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { Button } from '@lidofinance/lido-ui'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Form } from 'modules/shared/ui/Controls/Form'
import { Fieldset } from './CreateMotionFormStyle'

import { formParts, FormData, getDefaultFormPartsData } from './Parts'
import { MotionType } from '../../types'
import { getScriptFactoryByMotionType } from 'modules/motions/utils/getMotionType'
import { getMotionTypeDisplayName } from 'modules/motions/utils/getMotionTypeDisplayName'
import { toastError } from 'modules/toasts'

export function MotionFormStartNew() {
  const currentChainId = useCurrentChain()
  // const [isSubmitting, setSubmitting] = useState(false)

  const formMethods = useForm<FormData>({
    defaultValues: {
      motionType: null,
      ...getDefaultFormPartsData(),
    },
  })

  const motionContract = useContractMotionWeb3()

  const handleSubmit = useCallback(
    async e => {
      try {
        const motionType = formMethods.getValues('motionType')
        if (!motionType) return
        // setSubmitting(true)
        const res = await formParts[motionType].onSubmit({
          evmScriptFactory: getScriptFactoryByMotionType(
            currentChainId,
            motionType,
          ),
          formData: e[motionType],
          contract: motionContract,
        })
        console.log(res)
      } catch (error) {
        console.error(String(error))
        console.error(error)
        toastError(String(error))
      } finally {
        // setSubmitting(false)
      }
    },
    [currentChainId, formMethods, motionContract],
  )

  const motionType = formMethods.watch('motionType')
  const CurrentFormPart = motionType ? formParts[motionType].Component : null

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      <Fieldset>
        <SelectControl name="motionType" label="Motion type">
          {Object.values(MotionType).map(type => (
            <Option
              key={type}
              value={type}
              children={getMotionTypeDisplayName(type)}
            />
          ))}
        </SelectControl>
      </Fieldset>
      {CurrentFormPart && <CurrentFormPart />}
      {motionType && (
        <Button
          type="submit"
          fullwidth
          children="Submit"
          // loading={isSubmitting}
        />
      )}
    </Form>
  )
}