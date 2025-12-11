import { utils } from 'ethers'

import { Fragment } from 'react'
import { useFieldArray } from 'react-hook-form'
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

import { ContractSetLiabilitySharesTargetInVaultHub } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useVaultsDataMap } from 'modules/vaults/hooks/useVaultsDataMap'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { validateEtherValue } from 'modules/motions/utils/validateEtherValue'
import { VaultAddressInputControl } from 'modules/vaults/ui/VaultAddressInputControl'

type VaultInput = {
  address: string
  liabilitySharesTargets: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SetLiabilitySharesTargetInVaultHub,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'uint256[]'],
      [
        formData.vaults.map(vault => utils.getAddress(vault.address)),
        formData.vaults.map(vault =>
          utils.parseEther(vault.liabilitySharesTargets),
        ),
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
        liabilitySharesTargets: '',
      },
    ] as VaultInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()

    const trustedCaller = ContractSetLiabilitySharesTargetInVaultHub.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const { getVaultData } = useVaultsDataMap()

    const vaultsFieldArray = useFieldArray({ name: fieldNames.vaults })

    const handleAddUpdate = () =>
      vaultsFieldArray.append({
        address: '',
        liabilitySharesTargets: '',
      } as VaultInput)

    if (trustedCaller.initialLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    return (
      <>
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
                <VaultAddressInputControl
                  vaultsFieldName={fieldNames.vaults}
                  fieldIndex={fieldIndex}
                  getVaultData={getVaultData}
                  extraValidateFn={vaultData => {
                    if (!vaultData.isVaultConnected) {
                      return 'Vault is not connected in the Operator Grid'
                    }
                  }}
                />
              </Fieldset>

              <Fieldset>
                <InputNumberControl
                  name={`${fieldNames.vaults}.${fieldIndex}.liabilitySharesTargets`}
                  label="Liability Shares Target"
                  rules={{
                    required: 'Field is required',
                    validate: value => {
                      const amountError = validateEtherValue(value)
                      if (amountError) {
                        return amountError
                      }

                      return true
                    },
                  }}
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
