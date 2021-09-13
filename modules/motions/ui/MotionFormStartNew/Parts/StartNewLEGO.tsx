import { utils } from 'ethers'

import { useCallback, Fragment } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useLegoTokenOptions } from 'modules/motions/hooks/useLegoTokenOptions'

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
  motionType: MotionType.LEGOTopUp,
  onSubmit: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'uint256[]'],
      [
        formData.tokens.map(t => utils.getAddress(t.address)),
        formData.tokens.map(t => utils.parseEther(t.amount)),
      ],
    )
    toastInfo('Confirm transaction with Gnosis Safe')
    const res = await contract.createMotion(evmScriptFactory, encodedCallData, {
      gasLimit: 500000,
    })
    console.log(res)
    return res
  },
  getDefaultFormData: () => ({
    tokens: [{ address: '', amount: '' }] as Program[],
  }),
  getComponent: ({ fieldNames }) =>
    function StartNewMotionMotionFormLego() {
      const fieldsArr = useFieldArray({ name: fieldNames.tokens })

      const handleAddToken = useCallback(
        () => fieldsArr.append({ address: '', amount: '' }),
        [fieldsArr],
      )

      const handleRemoveToken = useCallback(
        (i: number) => fieldsArr.remove(i),
        [fieldsArr],
      )

      const tokenOptions = useLegoTokenOptions()

      return (
        <>
          {fieldsArr.fields.map((item, i) => (
            <Fragment key={item.id}>
              <Fieldset>
                <SelectControl
                  label="Token"
                  name={`${fieldNames.tokens}.${i}.address`}
                  rules={{ required: 'Field is required' }}
                >
                  {tokenOptions.map(({ label, value }, j) => (
                    <Option key={j} value={value} children={label} />
                  ))}
                </SelectControl>
              </Fieldset>

              <Fieldset>
                <InputControl
                  label="Amount"
                  name={`${fieldNames.tokens}.${i}.amount`}
                  rules={{
                    required: 'Field is required',
                    validate: validateToken,
                  }}
                />
              </Fieldset>

              {fieldsArr.fields.length > 1 && (
                <RemoveItemButton onClick={() => handleRemoveToken(i)}>
                  Remove token {i + 1}
                </RemoveItemButton>
              )}
            </Fragment>
          ))}

          {fieldsArr.fields.length < tokenOptions.length && (
            <Fieldset>
              <Button
                type="button"
                variant="outlined"
                size="sm"
                children="One more token"
                onClick={handleAddToken}
              />
            </Fieldset>
          )}
        </>
      )
    },
})
