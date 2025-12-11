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
import { useVaultsDataMap } from 'modules/vaults/hooks/useVaultsDataMap'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { validateUintValue } from 'modules/motions/utils/validateUintValue'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { MAX_FEE_BP } from 'modules/vaults/constants'
import { BpValueFormatted } from 'modules/vaults/ui/BpValueFormatted'
import { VaultAddressInputControl } from 'modules/vaults/ui/VaultAddressInputControl'
import { useSWR } from 'modules/network/hooks/useSwr'

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
    const { walletAddress, chainId } = useWeb3()

    const { vaultsDataMap, getVaultData } = useVaultsDataMap()

    const factoryContract = ContractUpdateVaultsFeesInOperatorGrid.useRpc()

    const { data: factoryData, initialLoading: isFactoryDataLoading } = useSWR(
      `update-vaults-fees-data-${chainId}`,
      async () => {
        const [
          trustedCaller,
          maxLiquidityFeeBP,
          maxReservationFeeBP,
          maxInfraFeeBP,
        ] = await Promise.all([
          factoryContract.trustedCaller(),
          factoryContract.maxLiquidityFeeBP(),
          factoryContract.maxReservationFeeBP(),
          factoryContract.maxInfraFeeBP(),
        ])

        return {
          trustedCaller,
          maxLiquidityFeeBP: maxLiquidityFeeBP.toNumber(),
          maxReservationFeeBP: maxReservationFeeBP.toNumber(),
          maxInfraFeeBP: maxInfraFeeBP.toNumber(),
        }
      },
      {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
      },
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

    if (isFactoryDataLoading || !factoryData) {
      return <PageLoader />
    }

    if (factoryData.trustedCaller !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    return (
      <>
        <MotionInfoBox>
          Current factory-level maximum fees
          <br />
          Max infra fee (BP): {factoryData.maxInfraFeeBP}
          <br />
          Max liquidity fee (BP): {factoryData.maxLiquidityFeeBP}
          <br />
          Max reservation liquidity fee (BP): {factoryData.maxReservationFeeBP}
        </MotionInfoBox>
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
                  <VaultAddressInputControl
                    vaultsFieldName={fieldNames.vaults}
                    fieldIndex={fieldIndex}
                    getVaultData={getVaultData}
                    extraValidateFn={vaultData => {
                      if (vaultData.isPendingDisconnect) {
                        return 'Vault is pending disconnect in the Operator Grid'
                      }
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

                        // Check for factory maximum
                        if (valueNum > factoryData.maxInfraFeeBP) {
                          return `Value must be less than or equal to ${factoryData.maxInfraFeeBP}`
                        }

                        if (!vaultTierInfo) {
                          return true
                        }

                        // Check for tier maximum
                        if (valueNum > vaultTierInfo.infraFeeBP) {
                          return `Value must be less than or equal to ${vaultTierInfo.infraFeeBP}`
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

                        // Check for factory maximum
                        if (valueNum > factoryData.maxLiquidityFeeBP) {
                          return `Value must be less than or equal to ${factoryData.maxLiquidityFeeBP}`
                        }

                        if (!vaultTierInfo) {
                          return true
                        }

                        // Check for tier maximum
                        if (valueNum > vaultTierInfo.liquidityFeeBP) {
                          return `Value must be less than or equal to ${vaultTierInfo.liquidityFeeBP}`
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

                        // Check for factory maximum
                        if (valueNum > factoryData.maxReservationFeeBP) {
                          return `Value must be less than or equal to ${factoryData.maxReservationFeeBP}`
                        }

                        if (!vaultTierInfo) {
                          return true
                        }

                        // Check for tier maximum
                        if (valueNum > vaultTierInfo.reservationFeeBP) {
                          return `Value must be less than or equal to ${vaultTierInfo.reservationFeeBP}`
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
