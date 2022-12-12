import { utils } from 'ethers'

import { Fragment, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useReferralPartnersActual } from 'modules/motions/hooks/useReferralPartners'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

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

import {
  ContractGovernanceToken,
  ContractEvmReferralPartnerTopUp,
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
  motionType: MotionType.ReferralPartnerTopUp,
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
    const { chainId, walletAddress } = useWeb3()
    const trustedCaller = ContractEvmReferralPartnerTopUp.useSwrWeb3(
      'trustedCaller',
      [],
    )
    const isTrustedCallerConnected = trustedCaller.data === walletAddress

    const referralPartners = useReferralPartnersActual()
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
      if (!referralPartners.data) return []
      const thatAddress = selectedPrograms[fieldIdx].address
      const selectedAddresses = selectedPrograms.map(({ address }) => address)
      return referralPartners.data.filter(
        ({ address }) =>
          !selectedAddresses.includes(address) || address === thatAddress,
      )
    }

    const tokenAddress = ContractGovernanceToken.address[chainId] as string
    const transitionLimit = TRANSITION_LIMITS[chainId][tokenAddress]

    if (trustedCaller.initialLoading || referralPartners.initialLoading) {
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
                <FieldsHeaderDesc>Program #{i + 1}</FieldsHeaderDesc>
                {fieldsArr.fields.length > 1 && (
                  <RemoveItemButton onClick={() => handleRemoveProgram(i)}>
                    Remove program
                  </RemoveItemButton>
                )}
              </FieldsHeader>
              <Fieldset>
                <SelectControl
                  label="Referral partner address"
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
                        return tokenLimitError(
                          governanceSymbol,
                          transitionLimit,
                        )
                      }
                      return true
                    },
                  }}
                />
              </Fieldset>
            </FieldsWrapper>
          </Fragment>
        ))}

        {referralPartners.data &&
          fieldsArr.fields.length < referralPartners.data.length && (
            <Fieldset>
              <ButtonIcon
                type="button"
                variant="ghost"
                size="sm"
                children="One more program"
                onClick={handleAddProgram}
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
