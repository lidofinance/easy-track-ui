import { utils } from 'ethers'

import { Fragment, useCallback } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useContractRpcSwr } from 'modules/blockChain/hooks/useContractRpcSwr'
import { useContractRewardProgramRegistryRpc } from 'modules/blockChain/hooks/useContractRewardProgramRegistry'

import { Button } from '@lidofinance/lido-ui'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Fieldset } from '../CreateMotionFormStyle'

import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { validateToken } from 'modules/tokens/utils/validateToken'

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
    await contract.createMotion(evmScriptFactory, encodedCallData, {
      gasLimit: 500000,
    })
  },
  getDefaultFormData: () => ({
    programs: [{ address: '', amount: '' }] as Program[],
  }),
  getComponent: ({ fieldNames }) =>
    function StartNewMotionMotionFormLego() {
      const contract = useContractRewardProgramRegistryRpc()
      const { data: rewardPrograms, initialLoading } = useContractRpcSwr(
        contract,
        'getRewardPrograms',
      )

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
                  {rewardPrograms?.map((value, j) => (
                    <Option key={j} value={value} children={value} />
                  ))}
                </SelectControl>
              </Fieldset>

              <Fieldset>
                <InputControl
                  label="LDO Amount"
                  name={`${fieldNames.programs}.${i}.amount`}
                  rules={{
                    required: 'Field is required',
                    validate: validateToken,
                  }}
                />
              </Fieldset>

              {fieldsArr.fields.length > 1 && (
                <Fieldset>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    children="Remove"
                    onClick={() => handleRemoveProgram(i)}
                  />
                  <br />
                  <br />
                </Fieldset>
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
