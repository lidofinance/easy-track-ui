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

import { ContractUpdateVaultsFeesInOperatorGrid } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { useVaultsDataMap } from 'modules/vaults/hooks/useVaultsDataMap'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { validateUintValue } from 'modules/motions/utils/validateUintValue'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { MAX_FEE_BP } from 'modules/vaults/constants'
import { BpValueFormatted } from 'modules/vaults/ui/BpValueFormatted'

type VaultFeesInput = {
  address: string
  infraFeeBP: string
  liquidityFeeBP: string
  reservationFeeBP: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.UpdateVaultsFeesInOperatorGrid,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'uint256[]', 'uint256[]', 'uint256[]'],
      [
        formData.vaults.map(vault => utils.getAddress(vault.address)),
        formData.vaults.map(vault => Number(vault.infraFeeBP)),
        formData.vaults.map(vault => Number(vault.liquidityFeeBP)),
        formData.vaults.map(vault => Number(vault.reservationFeeBP)),
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
        infraFeeBP: '',
        liquidityFeeBP: '',
        reservationFeeBP: '',
      },
    ] as VaultFeesInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()

    const { vaultsDataMap, getVaultData } = useVaultsDataMap()

    const trustedCaller = ContractUpdateVaultsFeesInOperatorGrid.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const vaultsFieldArray = useFieldArray({ name: fieldNames.vaults })

    const { watch } = useFormContext()
    const vaultsInputs: VaultFeesInput[] = watch(fieldNames.vaults)

    const handleAddUpdate = () =>
      vaultsFieldArray.append({
        address: '',
        infraFeeBP: '',
        liquidityFeeBP: '',
        reservationFeeBP: '',
      } as VaultFeesInput)

    if (trustedCaller.initialLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    return (
      <>
        {vaultsFieldArray.fields.map((item, fieldIndex) => {
          const vaultTierInfo =
            vaultsDataMap[vaultsInputs[fieldIndex]?.address.toLowerCase()]
          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {vaultsFieldArray.fields.length > 1 && (
                    <FieldsHeaderDesc>
                      Update #{fieldIndex + 1}
                    </FieldsHeaderDesc>
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

                        const vaultData = await getVaultData(lowerAddress)

                        if (!vaultData) {
                          return 'Invalid vault address'
                        }

                        if (!vaultData.isVaultConnected) {
                          return 'Vault is not connected in the Operator Grid'
                        }

                        if (vaultData.isPendingDisconnect) {
                          return 'Vault is pending disconnect in the Operator Grid'
                        }

                        return true
                      },
                    }}
                  />
                </Fieldset>

                {vaultTierInfo && (
                  <MotionInfoBox>
                    Current vault fees
                    <br />
                    Infra fee (BP): {vaultTierInfo.infraFeeBP}
                    <br />
                    Liquidity fee (BP): {vaultTierInfo.liquidityFeeBP}
                    <br />
                    Reservation liquidity fee (BP):{' '}
                    {vaultTierInfo.reservationFeeBP}
                  </MotionInfoBox>
                )}

                <Fieldset>
                  <InputNumberControl
                    name={`${fieldNames.vaults}.${fieldIndex}.infraFeeBP`}
                    label="Infra fee (BP)"
                    disabled={!vaultTierInfo}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const uintError = validateUintValue(value)
                        if (uintError) {
                          return uintError
                        }

                        const valueNum = Number(value)

                        if (valueNum > MAX_FEE_BP) {
                          return `Value must be less than or equal to ${MAX_FEE_BP}`
                        }

                        if (!vaultTierInfo) {
                          return true
                        }

                        if (valueNum > vaultTierInfo.infraFeeBP) {
                          return 'Value must be less than or equal to current'
                        }

                        return true
                      },
                    }}
                  />
                  <BpValueFormatted
                    fieldName={`${fieldNames.vaults}.${fieldIndex}.infraFeeBP`}
                    label="Infra fee"
                  />
                </Fieldset>

                <Fieldset>
                  <InputNumberControl
                    name={`${fieldNames.vaults}.${fieldIndex}.liquidityFeeBP`}
                    label="Liquidity fee (BP)"
                    disabled={!vaultTierInfo}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const uintError = validateUintValue(value)
                        if (uintError) {
                          return uintError
                        }

                        const valueNum = Number(value)

                        if (valueNum > MAX_FEE_BP) {
                          return `Value must be less than or equal to ${MAX_FEE_BP}`
                        }

                        if (!vaultTierInfo) {
                          return true
                        }

                        if (valueNum > vaultTierInfo.liquidityFeeBP) {
                          return 'Value must be less than or equal to current'
                        }

                        return true
                      },
                    }}
                  />
                  <BpValueFormatted
                    fieldName={`${fieldNames.vaults}.${fieldIndex}.liquidityFeeBP`}
                    label="Liquidity fee"
                  />
                </Fieldset>

                <Fieldset>
                  <InputNumberControl
                    name={`${fieldNames.vaults}.${fieldIndex}.reservationFeeBP`}
                    label="Reservation liquidity fee (BP)"
                    disabled={!vaultTierInfo}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const uintError = validateUintValue(value)
                        if (uintError) {
                          return uintError
                        }

                        const valueNum = Number(value)

                        if (valueNum > MAX_FEE_BP) {
                          return `Value must be less than or equal to ${MAX_FEE_BP}`
                        }

                        if (!vaultTierInfo) {
                          return true
                        }

                        if (valueNum > vaultTierInfo.reservationFeeBP) {
                          return 'Value must be less than or equal to current'
                        }

                        return true
                      },
                    }}
                  />
                  <BpValueFormatted
                    fieldName={`${fieldNames.vaults}.${fieldIndex}.reservationFeeBP`}
                    label="Reservation liquidity fee"
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          )
        })}

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
