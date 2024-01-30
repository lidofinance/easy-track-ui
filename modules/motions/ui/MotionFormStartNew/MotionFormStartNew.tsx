import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useAvailableMotions } from 'modules/motions/hooks'
import { useSendTransactionGnosisWorkaround } from 'modules/blockChain/hooks/useSendTransactionGnosisWorkaround'

import { Button, ToastError } from '@lidofinance/lido-ui'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { Form } from 'modules/shared/ui/Controls/Form'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Fieldset, RetryHint, MessageBox } from './CreateMotionFormStyle'

import { formParts, FormData, getDefaultFormPartsData } from './Parts'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import {
  getScriptFactoryByMotionType,
  getMotionTypeDisplayName,
} from 'modules/motions/utils'
import { ResultTx } from 'modules/blockChain/types'
import { getErrorMessage } from 'modules/shared/utils/getErrorMessage'
import { MotionTypeForms } from 'modules/motions/types'
import { useActiveMotionsMap } from 'modules/motions/hooks/useActiveMotionsMap'
import { getMotionValidator } from 'modules/motions/validation'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'

type SubmitError = {
  message: string
  type: 'warning' | 'error'
}

type Props = {
  onComplete: (tx: ResultTx) => void
}

export function MotionFormStartNew({ onComplete }: Props) {
  const { chainId } = useWeb3()
  const [isSubmitting, setSubmitting] = useState(false)
  const sendTransaction = useSendTransactionGnosisWorkaround()

  const { availableMotions, initialLoading, notHaveAvailableMotions } =
    useAvailableMotions()

  const formMethods = useForm<FormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      motionType: null,
      ...getDefaultFormPartsData(),
    },
  })

  const submitError = formMethods.formState.errors.root?.submitError as
    | SubmitError
    | undefined

  useEffect(() => {
    formMethods.reset()
  }, [formMethods, availableMotions])

  const contractEasyTrack = ContractEasyTrack.useWeb3()

  const { data: activeMotionsMap, initialLoading: isActiveMotionsMapLoading } =
    useActiveMotionsMap()

  const handleSubmit = useCallback(
    async e => {
      try {
        const motionType = formMethods.getValues('motionType')
        if (!motionType) return
        setSubmitting(true)

        const evmScriptFactory = getScriptFactoryByMotionType(
          chainId,
          motionType,
        )

        if (!evmScriptFactory) {
          throw new Error(
            `EVM script factory for motion type ${motionType} in chain ${chainId} not found`,
          )
        }

        const validateMotion = getMotionValidator(motionType)

        if (validateMotion) {
          if (!activeMotionsMap) {
            formMethods.setError('root.submitError', {
              message:
                'Could not get active motions data. Please try again later',
              type: 'error',
            })
            return
          }

          const validationError = await validateMotion({
            evmScriptFactory,
            activeMotionsMap,
            formData: e[motionType],
            chainId,
          })

          if (
            validationError &&
            (submitError?.type !== 'warning' ||
              validationError.type === 'error')
          ) {
            formMethods.setError('root.submitError', validationError)
            setSubmitting(false)

            return
          }
        }

        const tx = await formParts[motionType].populateTx({
          evmScriptFactory,
          formData: e[motionType],
          contract: contractEasyTrack,
        })

        const res = await sendTransaction(tx)

        onComplete(res)
      } catch (error: any) {
        console.error(error)
        ToastError(getErrorMessage(error), {})
        setSubmitting(false)
      }
    },
    [
      formMethods,
      submitError,
      chainId,
      contractEasyTrack,
      activeMotionsMap,
      sendTransaction,
      onComplete,
    ],
  )

  const motionType = formMethods.watch('motionType')
  const CurrentFormPart = motionType ? formParts[motionType].Component : null

  useEffect(() => {
    formMethods.clearErrors('root.submitError')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionType])

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

  if (initialLoading || isActiveMotionsMapLoading) return <PageLoader />
  if (notHaveAvailableMotions || !availableMotions) {
    return (
      <MessageBox>
        Only Trusted Callers & Node Operator have access to Easy Track motion
        creation
      </MessageBox>
    )
  }

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      {submitError && (
        <MotionInfoBox $variant={submitError.type}>
          {submitError.message}{' '}
          {submitError.type === 'warning'
            ? 'Submit form again if you want to proceed'
            : null}
        </MotionInfoBox>
      )}
      <Fieldset>
        <SelectControl name="motionType" label="Motion type">
          {Object.values(MotionTypeForms)
            .filter(motion => Boolean(availableMotions[motion]))
            .map((type: MotionTypeForms) => (
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
