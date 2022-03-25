import { utils } from 'ethers'

import { Fragment, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useRewardProgramsActual } from 'modules/motions/hooks/useRewardPrograms'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { Button } from '@lidofinance/lido-ui'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
} from '../CreateMotionFormStyle'

import {
  ContractGovernanceToken,
  ContractEvmRewardProgramTopUp,
} from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { validateToken } from 'modules/tokens/utils/validateToken'
import { estimateGasFallback } from 'modules/motions/utils/estimateGasFallback'
import { TRANSITION_LIMITS, tokenLimitError } from 'modules/motions/constants'

type Program = {
  address: string
  amount: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.RewardProgramTopUp,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'uint256[]'],
      [
        formData.programs.map(p => utils.getAddress(p.address)),
        formData.programs.map(p => utils.parseEther(p.amount)),
      ],
    )
    const gasLimit = await estimateGasFallback(
      contract.estimateGas.createMotion(evmScriptFactory, encodedCallData),
    )
    const tx = await contract.populateTransaction.createMotion(
      evmScriptFactory,
      encodedCallData,
      { gasLimit },
    )
    return tx
  },
  getDefaultFormData: () => ({
    programs: [{ address: '', amount: '' }] as Program[],
  }),
  Component: function StartNewMotionMotionFormLego({
    fieldNames,
    submitAction,
  }) {
    const chainId = useCurrentChain()
    const { walletAddress } = useWalletInfo()
    const trustedCaller = ContractEvmRewardProgramTopUp.useSwrWeb3(
      'trustedCaller',
      [],
    )
    const isTrustedCallerConnected = trustedCaller.data === walletAddress

    const rewardPrograms = useRewardProgramsActual()
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

    const { watch } = useFormContext()
    const selectedPrograms: Program[] = watch(fieldNames.programs)

    const getFilteredOptions = (fieldIdx: number) => {
      if (!rewardPrograms.data) return []
      const thatAddress = selectedPrograms[fieldIdx].address
      const selectedAddresses = selectedPrograms.map(({ address }) => address)
      return rewardPrograms.data.filter(
        ({ address }) =>
          !selectedAddresses.includes(address) || address === thatAddress,
      )
    }

    const tokenAddress = ContractGovernanceToken.address[chainId] as string
    const transitionLimit = TRANSITION_LIMITS[chainId][tokenAddress]

    if (trustedCaller.initialLoading || rewardPrograms.initialLoading) {
      return <PageLoader />
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

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
                {getFilteredOptions(i).map((program, j) => (
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
                  validate: value => {
                    const check1 = validateToken(value)
                    if (typeof check1 === 'string') {
                      return check1
                    }
                    if (Number(value) > transitionLimit) {
                      return tokenLimitError(governanceSymbol, transitionLimit)
                    }
                    return true
                  },
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

        {rewardPrograms.data &&
          fieldsArr.fields.length < rewardPrograms.data.length && (
            <Fieldset>
              <Button
                type="button"
                variant="outlined"
                size="sm"
                children="One more program"
                onClick={handleAddProgram}
              />
            </Fieldset>
          )}

        {submitAction}
      </>
    )
  },
})
