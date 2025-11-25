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

import { ContractForceValidatorExitsInVaultHub } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { useVaultsDataMap } from 'modules/vaults/hooks/useVaultsDataMap'

type VaultInput = {
  address: string
  pubkey: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.ForceValidatorExitsInVaultHub,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'bytes[]'],
      [
        formData.vaults.map(vault => utils.getAddress(vault.address)),
        formData.vaults.map(vault => vault.pubkey),
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
        pubkey: '',
      },
    ] as VaultInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()

    const trustedCaller = ContractForceValidatorExitsInVaultHub.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const { getVaultData } = useVaultsDataMap()

    const vaultsFieldArray = useFieldArray({ name: fieldNames.vaults })

    const handleAddUpdate = () =>
      vaultsFieldArray.append({
        address: '',
        pubkey: '',
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
                  <FieldsHeaderDesc>Exit #{fieldIndex + 1}</FieldsHeaderDesc>
                )}
                {vaultsFieldArray.fields.length > 1 && (
                  <RemoveItemButton
                    onClick={() => vaultsFieldArray.remove(fieldIndex)}
                  >
                    Remove exit {fieldIndex + 1}
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

                      const vaultData = await getVaultData(lowerAddress)

                      if (!vaultData) {
                        return 'Invalid vault address'
                      }

                      if (!vaultData.isVaultConnected) {
                        return 'Vault is not connected in the Operator Grid'
                      }

                      return true
                    },
                  }}
                />
              </Fieldset>

              <Fieldset>
                <InputControl
                  name={`${fieldNames.vaults}.${fieldIndex}.pubkey`}
                  label="Pubkey"
                  rules={{
                    required: 'Field is required',
                    validate: value => {
                      if (!/^0x[0-9a-fA-F]{96}$/.test(value)) {
                        return 'Pubkey must be a 48-byte hex string prefixed with 0x'
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
