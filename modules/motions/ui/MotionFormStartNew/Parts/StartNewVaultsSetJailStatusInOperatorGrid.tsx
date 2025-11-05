import { utils } from 'ethers'

import { Fragment } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, ButtonIcon } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
} from '../CreateMotionFormStyle'

import { ContractSetJailStatusInOperatorGrid } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { useVaultOperatorMap } from 'modules/vaults/hooks/useVaultOperatorMap'
import { isAddress } from 'ethers/lib/utils'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { CheckboxControl } from 'modules/shared/ui/Controls/Checkbox'

type VaultInput = {
  address: string
  isInJail: boolean
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SetJailStatusInOperatorGrid,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'bool[]'],
      [
        formData.vaults.map(vault => utils.getAddress(vault.address)),
        formData.vaults.map(vault => vault.isInJail),
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
    vaults: [
      {
        address: '',
        isInJail: false,
      },
    ] as VaultInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()

    const trustedCaller = ContractSetJailStatusInOperatorGrid.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const { vaultMap, getVaultNodeOperator } = useVaultOperatorMap()

    const vaultsFieldArray = useFieldArray({ name: fieldNames.vaults })

    const { formState, watch } = useFormContext()
    const vaultsInputs: VaultInput[] = watch(fieldNames.vaults)

    const handleAddUpdate = () =>
      vaultsFieldArray.append({
        address: '',
        isInJail: false,
      } as VaultInput)

    if (trustedCaller.initialLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    const sharedNodeOperatorAddress =
      !formState.errors[`${fieldNames.vaults}.0.address`] &&
      vaultMap[vaultsInputs[0]?.address.toLowerCase()]

    return (
      <>
        <MotionInfoBox>
          Note: all vaults within the motion must share the node operator
          address.
          {typeof sharedNodeOperatorAddress === 'string' &&
          isAddress(sharedNodeOperatorAddress) ? (
            <>
              <br />
              Current address:
              <AddressInlineWithPop
                address={sharedNodeOperatorAddress}
                trim={false}
              />
            </>
          ) : null}
        </MotionInfoBox>
        {vaultsFieldArray.fields.map((item, fieldIndex) => (
          <Fragment key={item.id}>
            <FieldsWrapper>
              <FieldsHeader>
                {vaultsFieldArray.fields.length > 1 && (
                  <FieldsHeaderDesc>Update #{fieldIndex + 1}</FieldsHeaderDesc>
                )}
                {vaultsFieldArray.fields.length > 1 && (
                  <RemoveItemButton
                    onClick={() => vaultsFieldArray.remove(fieldIndex)}
                  >
                    Remove update {fieldIndex + 1}
                  </RemoveItemButton>
                )}
              </FieldsHeader>

              <Fieldset>
                <InputControl
                  name={`${fieldNames.vaults}.${fieldIndex}.address`}
                  label="Vault address"
                  rules={{
                    required: 'Field is required',
                    validate: async value => {
                      const addressErr = validateAddress(value)
                      if (addressErr) {
                        return addressErr
                      }

                      const lowerAddress = value.toLowerCase()

                      const addressInGroupInputIndex = vaultsInputs.findIndex(
                        ({ address }, index) =>
                          address.toLowerCase() === lowerAddress &&
                          fieldIndex !== index,
                      )

                      if (addressInGroupInputIndex !== -1) {
                        return 'Address is already in use by another update within the motion'
                      }

                      const vaultNodeOperator = await getVaultNodeOperator(
                        lowerAddress,
                      )

                      if (!vaultNodeOperator) {
                        return 'Vault not found'
                      }

                      if (
                        fieldIndex > 0 &&
                        vaultNodeOperator !== sharedNodeOperatorAddress
                      ) {
                        return 'All vaults within the motion must share the same node operator address'
                      }

                      return true
                    },
                  }}
                />
              </Fieldset>

              <Fieldset>
                <CheckboxControl
                  label="Put vault in jail"
                  name={`${fieldNames.vaults}.${fieldIndex}.isInJail`}
                />
              </Fieldset>
            </FieldsWrapper>
          </Fragment>
        ))}

        <Fieldset>
          <ButtonIcon
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddUpdate}
            icon={<Plus />}
            color="secondary"
          >
            One more update
          </ButtonIcon>
        </Fieldset>

        {submitAction}
      </>
    )
  },
})
