import { utils } from 'ethers'

import { useCallback, Fragment } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useLegoTokenOptions } from 'modules/motions/hooks/useLegoTokenOptions'

import { Button } from '@lidofinance/lido-ui'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
} from '../CreateMotionFormStyle'

import { ContractEvmLEGOTopUp } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { validateToken } from 'modules/tokens/utils/validateToken'

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
    const tx = await contract.populateTransaction.createMotion(
      evmScriptFactory,
      encodedCallData,
      {
        gasLimit: 500000,
      },
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
    const tokenOptions = useLegoTokenOptions()
    const fieldsArr = useFieldArray({ name: fieldNames.tokens })
    const { walletAddress } = useWalletInfo()
    const trustedCaller = ContractEvmLEGOTopUp.useSwrWeb3('trustedCaller', [])
    const isTrustedCallerConnected = trustedCaller.data === walletAddress

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

        {submitAction}
      </>
    )
  },
})
