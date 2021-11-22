import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { Button } from '@lidofinance/lido-ui'
import { Form } from 'modules/shared/ui/Controls/Form'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Fieldset, RetryHint } from './CreateMotionFormStyle'

import { formParts, FormData, getDefaultFormPartsData } from './Parts'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { MotionType } from '../../types'
import { ToastError } from '@lidofinance/lido-ui'
import { getScriptFactoryByMotionType } from 'modules/motions/utils/getMotionType'
import { getMotionTypeDisplayName } from 'modules/motions/utils/getMotionTypeDisplayName'
import { sendTransactionGnosisWorkaround } from 'modules/blockChain/utils/sendTransactionGnosisWorkaround'
import { ResultTx } from 'modules/blockChain/types'

type Props = {
  onComplete: (tx: ResultTx) => void
}

export function MotionFormStartNew({ onComplete }: Props) {
  const currentChainId = useCurrentChain()
  const [isSubmitting, setSubmitting] = useState(false)

  const formMethods = useForm<FormData>({
    defaultValues: {
      motionType: null,
      ...getDefaultFormPartsData(),
    },
  })

  const contractEasyTrack = ContractEasyTrack.useWeb3()

  const handleSubmit = useCallback(
    async e => {
      try {
        const motionType = formMethods.getValues('motionType')
        if (!motionType) return

        setSubmitting(true)

        const tx = await formParts[motionType].populateTx({
          evmScriptFactory: getScriptFactoryByMotionType(
            currentChainId,
            motionType,
          ),
          formData: e[motionType],
          contract: contractEasyTrack,
        })

        const res = await sendTransactionGnosisWorkaround(
          contractEasyTrack.signer,
          tx,
        )

        onComplete(res)
      } catch (error: any) {
        console.error(error)
        ToastError(error.message || (error as any).toString())
        setSubmitting(false)
      }
    },
    [formMethods, currentChainId, contractEasyTrack, onComplete],
  )

  const motionType = formMethods.watch('motionType')
  const CurrentFormPart = motionType ? formParts[motionType].Component : null
  const submitAction = (
    <>
      <Button
        type="submit"
        fullwidth
        children="Submit"
        loading={isSubmitting}
      />
      {isSubmitting && (
        <RetryHint>
          If something went wrong press{' '}
          <button type="submit" children="Retry" />
        </RetryHint>
      )}
    </>
  )

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
      {CurrentFormPart && motionType && (
        <CurrentFormPart
          fieldNames={formParts[motionType].fieldNames as any}
          submitAction={submitAction}
        />
      )}
    </Form>
  )
}
