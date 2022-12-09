import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, ToastError } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  useAvailableMotions,
  HIDDEN_MOTIONS,
} from 'modules/motions/hooks/useAvailableMotions'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { Form } from 'modules/shared/ui/Controls/Form'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Fieldset, RetryHint, MessageBox } from './CreateMotionFormStyle'

import { formParts, FormData, getDefaultFormPartsData } from './Parts'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { getScriptFactoryByMotionType } from 'modules/motions/utils/getMotionType'
import { getMotionTypeDisplayName } from 'modules/motions/utils/getMotionTypeDisplayName'
import { sendTransactionGnosisWorkaround } from 'modules/blockChain/utils/sendTransactionGnosisWorkaround'
import { ResultTx } from 'modules/blockChain/types'

type Props = {
  onComplete: (tx: ResultTx) => void
}

export function MotionFormStartNew({ onComplete }: Props) {
  const { chainId } = useWeb3()
  const [isSubmitting, setSubmitting] = useState(false)

  const { availableMotions, notHaveAvailableMotions } = useAvailableMotions()

  const formMethods = useForm<FormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      motionType: null,
      ...getDefaultFormPartsData(),
    },
  })

  useEffect(() => {
    formMethods.reset()
  }, [formMethods, availableMotions])

  const contractEasyTrack = ContractEasyTrack.useWeb3()

  const handleSubmit = useCallback(
    async e => {
      try {
        const motionType = formMethods.getValues('motionType')
        if (!motionType) return

        setSubmitting(true)

        const tx = await formParts[motionType]?.populateTx({
          evmScriptFactory: getScriptFactoryByMotionType(chainId, motionType),
          formData: e[motionType],
          contract: contractEasyTrack,
        })

        if (!tx) return

        const res = await sendTransactionGnosisWorkaround(
          contractEasyTrack.signer,
          tx,
        )

        onComplete(res)
      } catch (error: any) {
        console.error(error)
        ToastError(error.message || (error as any).toString(), {})
        setSubmitting(false)
      }
    },
    [formMethods, chainId, contractEasyTrack, onComplete],
  )

  const motionType = formMethods.watch('motionType')
  const CurrentFormPart = motionType ? formParts[motionType]?.Component : null
  const submitAction = (
    <>
      <Button
        type="submit"
        fullwidth
        children="Submit"
        loading={isSubmitting}
        disabled={
          formMethods.formState.isDirty && !formMethods.formState.isValid
        }
      />
      {isSubmitting && (
        <RetryHint>
          If something went wrong press{' '}
          <button type="submit" children="Retry" />
        </RetryHint>
      )}
    </>
  )

  if (!availableMotions) return <PageLoader />
  if (notHaveAvailableMotions)
    return (
      <MessageBox>
        You should be connected as trusted caller or as node operator
      </MessageBox>
    )

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      <Fieldset>
        <SelectControl name="motionType" label="Motion type">
          {Object.values(MotionType)
            .filter(
              motion =>
                !HIDDEN_MOTIONS.includes(motion) && availableMotions[motion],
            )
            .map(type => (
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
          fieldNames={formParts[motionType]?.fieldNames as any}
          submitAction={submitAction}
        />
      )}
    </Form>
  )
}
