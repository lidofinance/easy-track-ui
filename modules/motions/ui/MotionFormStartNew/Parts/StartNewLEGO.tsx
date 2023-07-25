import { utils } from 'ethers'

import { useCallback, Fragment } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useLegoTokenOptions } from 'modules/motions/hooks/useLegoTokenOptions'
import { useTransitionLimits } from 'modules/motions/hooks/useTransitionLimits'

import { ButtonIcon, Plus } from '@lidofinance/lido-ui'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
} from '../CreateMotionFormStyle'

import { ContractEvmLEGOTopUp } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { validateToken } from 'modules/tokens/utils/validateToken'
import { estimateGasFallback } from 'modules/motions/utils/estimateGasFallback'
import { tokenLimitError } from 'modules/motions/constants'

type TokenData = {
  address: string
  amount: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.LEGOTopUp,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'uint256[]'],
      [
        formData.tokens.map(t => utils.getAddress(t.address)),
        formData.tokens.map(t => utils.parseEther(t.amount)),
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
    tokens: [{ address: '', amount: '' }] as TokenData[],
  }),
  Component: function StartNewMotionMotionFormLego({
    fieldNames,
    submitAction,
  }) {
    const { walletAddress } = useWeb3()
    const tokenOptions = useLegoTokenOptions()
    const fieldsArr = useFieldArray({ name: fieldNames.tokens })
    const trustedCaller = ContractEvmLEGOTopUp.useSwrWeb3('trustedCaller', [])
    const isTrustedCallerConnected = trustedCaller.data === walletAddress
    const { data: limits } = useTransitionLimits()

    const handleAddToken = useCallback(
      () => fieldsArr.append({ address: '', amount: '' }),
      [fieldsArr],
    )

    const handleRemoveToken = useCallback(
      (i: number) => fieldsArr.remove(i),
      [fieldsArr],
    )

    const { watch } = useFormContext()
    const selectedTokens: TokenData[] = watch(fieldNames.tokens)

    const getFilteredOptions = (fieldIdx: number) => {
      const thatAddress = selectedTokens[fieldIdx].address
      const selectedAddresses = selectedTokens.map(({ address }) => address)
      return tokenOptions.filter(
        ({ value }) =>
          !selectedAddresses.includes(value) || value === thatAddress,
      )
    }

    const getTokenName = (fieldIdx: number) => {
      return tokenOptions.find(
        ({ value }) => value === selectedTokens[fieldIdx].address,
      )?.label
    }

    if (trustedCaller.initialLoading) {
      return <PageLoader />
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    return (
      <>
        {fieldsArr.fields.map((item, i) => (
          <Fragment key={item.id}>
            <FieldsWrapper>
              <FieldsHeader>
                <FieldsHeaderDesc>Token #{i + 1}</FieldsHeaderDesc>
                {fieldsArr.fields.length > 1 && (
                  <RemoveItemButton onClick={() => handleRemoveToken(i)}>
                    Remove token
                  </RemoveItemButton>
                )}
              </FieldsHeader>
              <Fieldset>
                <SelectControl
                  label="Token"
                  name={`${fieldNames.tokens}.${i}.address`}
                  rules={{ required: 'Field is required' }}
                >
                  {getFilteredOptions(i).map(({ label, value }, j) => (
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
                    validate: value => {
                      const check1 = validateToken(value)
                      if (typeof check1 === 'string') {
                        return check1
                      }
                      const { address } = selectedTokens[i]
                      const limit = limits?.[address]
                      if (limit && Number(value) > limit) {
                        return tokenLimitError(getTokenName(i), limit)
                      }
                      return true
                    },
                  }}
                />
              </Fieldset>
            </FieldsWrapper>
          </Fragment>
        ))}

        {fieldsArr.fields.length < tokenOptions.length && (
          <Fieldset>
            <ButtonIcon
              type="button"
              variant="ghost"
              size="sm"
              children="One more token"
              onClick={handleAddToken}
              icon={<Plus />}
              color="secondary"
            />
          </Fieldset>
        )}

        {submitAction}
      </>
    )
  },
})
