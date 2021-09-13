import { utils } from 'ethers'

import { Fragment, useCallback } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useRewardPrograms } from 'modules/motions/hooks/useRewardPrograms'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { Button } from '@lidofinance/lido-ui'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Fieldset, RemoveItemButton } from '../CreateMotionFormStyle'

import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { validateToken } from 'modules/tokens/utils/validateToken'
import { toastInfo } from 'modules/toasts'

type Program = {
  address: string
  amount: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.RewardProgramTopUp,
  onSubmit: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'uint256[]'],
      [
        formData.programs.map(p => utils.getAddress(p.address)),
        formData.programs.map(p => utils.parseEther(p.amount)),
      ],
    )
    toastInfo('Confirm transaction with Gnosis Safe')
    const res = await contract.createMotion(evmScriptFactory, encodedCallData, {
      gasLimit: 500000,
    })
    return res
  },
  getDefaultFormData: () => ({
    programs: [{ address: '', amount: '' }] as Program[],
  }),
  getComponent: ({ fieldNames }) =>
    function StartNewMotionMotionFormLego() {
      const { data: rewardPrograms, initialLoading } = useRewardPrograms()
      const { data: governanceSymbol } = useGovernanceSymbol()

      const fieldsArr = useFieldArray({ name: fieldNames.programs })

      const handleAddProgram = useCallback(
        () => fieldsArr.append({ address: '', amount: '' }),
        [fieldsArr],
      )

      const handleRemoveProgram = useCallback(
        (i: number) => fieldsArr.remove(i),
        [fieldsArr],
      )

      return (
        <>
          {fieldsArr.fields.map((item, i) => (
            <Fragment key={item.id}>
              <Fieldset>
                <SelectControl
                  label="Reward program address"
                  name={`${fieldNames.programs}.${i}.address`}
                  rules={{ required: 'Field is required' }}
                >
                  {initialLoading && (
                    <Option value="" disabled children="Loading" />
                  )}
                  {rewardPrograms?.map((program, j) => (
                    <Option
                      key={j}
                      value={program.address}
                      children={program.title}
                    />
                  ))}
                </SelectControl>
              </Fieldset>

              <Fieldset>
                <InputControl
                  label={`${governanceSymbol} Amount`}
                  name={`${fieldNames.programs}.${i}.amount`}
                  rules={{
                    required: 'Field is required',
                    validate: validateToken,
                  }}
                />
              </Fieldset>

              {fieldsArr.fields.length > 1 && (
                <RemoveItemButton onClick={() => handleRemoveProgram(i)}>
                  Remove program {i + 1}
                </RemoveItemButton>
              )}
            </Fragment>
          ))}

          {rewardPrograms && fieldsArr.fields.length < rewardPrograms.length && (
            <Fieldset>
              <Button
                type="button"
                variant="translucent"
                size="sm"
                children="One more program"
                onClick={handleAddProgram}
              />
            </Fieldset>
          )}
        </>
      )
    },
})
